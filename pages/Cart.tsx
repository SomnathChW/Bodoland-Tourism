import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import MenuButton from "@/components/UI/MenuButton";
import { useDataStore } from "@/store/useDataStore";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Cart = () => {
    const { toggleDrawer } = useDrawer();
    const { cart, removeFromCart, clearCart } = useDataStore();
    const [secureStoreCart, setSecureStoreCart] = useState<string[]>([]);

    // Load cart from secure store on component mount
    useEffect(() => {
        loadCartFromSecureStore();
    }, []);

    const loadCartFromSecureStore = async () => {
        try {
            const cartString = await SecureStore.getItemAsync("cart");
            if (cartString) {
                const cartArray = JSON.parse(cartString);
                setSecureStoreCart(cartArray);
            }
        } catch (error) {
            console.error("Error loading cart from secure store:", error);
        }
    };

    const handleRemoveFromCart = async (identifier: string) => {
        // Remove from store
        removeFromCart(identifier);

        // Remove from secure store
        try {
            const updatedCart = secureStoreCart.filter(
                (id) => id !== identifier
            );
            setSecureStoreCart(updatedCart);
            await SecureStore.setItemAsync("cart", JSON.stringify(updatedCart));
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const handleClearCart = async () => {
        // Clear store
        clearCart();

        // Clear secure store
        try {
            setSecureStoreCart([]);
            await SecureStore.setItemAsync("cart", JSON.stringify([]));
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const handleCheckout = () => {
        if (allCartItems.length === 0) return;

        // Create identifiers string from all cart items
        const identifiers = allCartItems.join(",");
        router.push(`/checkout?identifiers=${identifiers}`);
    };

    const renderCartItem = ({
        item,
        index,
    }: {
        item: string;
        index: number;
    }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemIndex}>#{index + 1}</Text>
                <Text style={styles.itemIdentifier}>{item}</Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromCart(item)}
            >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>
        </View>
    );

    const renderEmptyCart = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#444" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyDescription}>
                Start adding some souvenirs to your cart!
            </Text>
        </View>
    );

    // Combine cart items from both sources (prioritize secure store)
    const allCartItems = [
        ...new Set([
            ...secureStoreCart,
            ...cart.map((item) => item.identifier),
        ]),
    ];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                        <View>
                            <Text style={styles.headingText}>Cart</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                {allCartItems.length}{" "}
                                {allCartItems.length === 1 ? "item" : "items"}{" "}
                                in your cart
                            </Text>
                        </View>
                    </View>
                    {allCartItems.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearCart}
                        >
                            <Text style={styles.clearButtonText}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.pageContent}>
                    {allCartItems.length === 0 ? (
                        renderEmptyCart()
                    ) : (
                        <FlatList
                            data={allCartItems}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            renderItem={renderCartItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                </View>

                {/* Sticky Checkout Button */}
                {allCartItems.length > 0 && (
                    <View style={styles.checkoutButtonContainer}>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={handleCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>
                                Proceed to Checkout ({allCartItems.length}{" "}
                                items)
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
        paddingTop: StatusBar.currentHeight,
    },
    content: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "transparent",
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    headingText: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
    },
    mainSubHeaddingText: {
        fontSize: 14,
        color: "#8E8E93",
        fontFamily: "SF-Pro-Display-Medium",
    },
    buttons: {
        color: "white",
    },
    clearButton: {
        backgroundColor: "#ff4444",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    clearButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
    pageContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 100,
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1f26",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    itemInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    itemIndex: {
        fontSize: 16,
        fontWeight: "600",
        color: "#8E8E93",
        width: 40,
    },
    itemIdentifier: {
        fontSize: 16,
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
        flex: 1,
    },
    removeButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#2a1f1f",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginTop: 20,
        marginBottom: 10,
    },
    emptyDescription: {
        fontSize: 16,
        color: "#8E8E93",
        textAlign: "center",
        lineHeight: 24,
    },
    checkoutButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0d1116",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#333",
    },
    checkoutButton: {
        backgroundColor: "#fff",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    checkoutButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "SF-Pro-Display-Medium",
    },
});
