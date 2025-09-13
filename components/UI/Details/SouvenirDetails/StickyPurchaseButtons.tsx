/**
 * StickyPurchaseButtons Component
 * Author: SomnathChW
 * Created: 2025-07-10
 *
 * This component renders sticky purchase buttons at the bottom of the screen
 * for souvenirs and other purchasable items.
 */

import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useDataStore } from "@/store/useDataStore";
import { toast } from "sonner-native";

interface StickyPurchaseButtonsProps {
    inStock: boolean;
    souvenirIdentifier: string;
}

const { width } = Dimensions.get("window");

const StickyPurchaseButtons: React.FC<StickyPurchaseButtonsProps> = ({
    inStock,
    souvenirIdentifier,
}) => {
    const insets = useSafeAreaInsets();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { addToCart } = useDataStore();

    const handleAddToCart = async () => {
        if (!souvenirIdentifier || isAddingToCart) return;

        setIsAddingToCart(true);

        try {
            // Add to cart store
            addToCart(souvenirIdentifier);

            // Get existing cart from secure store
            const existingCartString = await SecureStore.getItemAsync("cart");
            let existingCart: string[] = [];

            if (existingCartString) {
                try {
                    existingCart = JSON.parse(existingCartString);
                } catch (error) {
                    console.error(
                        "Error parsing cart from secure store:",
                        error
                    );
                }
            }

            // Check if item already exists in cart
            if (!existingCart.includes(souvenirIdentifier)) {
                existingCart.push(souvenirIdentifier);
                await SecureStore.setItemAsync(
                    "cart",
                    JSON.stringify(existingCart)
                );
            }

            toast.success("Added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: Math.max(insets.bottom, 10) },
            ]}
        >
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.addToCartButton,
                        isAddingToCart && styles.buttonDisabled,
                    ]}
                    disabled={!inStock || isAddingToCart}
                    onPress={handleAddToCart}
                >
                    {isAddingToCart ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Ionicons name="cart-outline" size={20} color="#FFF" />
                    )}
                    <Text style={styles.buttonText}>
                        {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buyNowButton]}
                    disabled={!inStock}
                >
                    <Ionicons name="flash-outline" size={20} color="#000" />
                    <Text style={[styles.buttonText, styles.buyNowText]}>
                        {inStock ? `Buy Now` : `Out of Stock`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0d1116",
        borderTopWidth: 1,
        borderTopColor: "#333",
        paddingTop: 10,
        paddingHorizontal: 20,
        zIndex: 1000,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    addToCartButton: {
        backgroundColor: "#333",
        borderWidth: 1,
        borderColor: "#444",
    },
    buyNowButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    buttonText: {
        marginLeft: 8,
        fontWeight: "bold",
        color: "#fff",
        fontSize: 14,
    },
    buyNowText: {
        color: "#000",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});

export default React.memo(StickyPurchaseButtons);
