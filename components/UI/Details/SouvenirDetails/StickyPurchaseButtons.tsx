/**
 * StickyPurchaseButtons Component
 * Author: SomnathChW
 * Created: 2025-07-10
 *
 * This component renders sticky purchase buttons at the bottom of the screen
 * for souvenirs and other purchasable items.
 */

import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StickyPurchaseButtonsProps {
    inStock: boolean;
}

const { width } = Dimensions.get("window");

const StickyPurchaseButtons: React.FC<StickyPurchaseButtonsProps> = ({
    inStock,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: Math.max(insets.bottom, 10) },
            ]}
        >
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.addToCartButton]}
                    disabled={!inStock}
                >
                    <Ionicons name="cart-outline" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Add to Cart</Text>
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
});

export default React.memo(StickyPurchaseButtons);
