import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Dimensions,
    TextInput,
    ScrollView,
    Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const { width } = Dimensions.get("window");

interface CheckoutProps {
    item_identifiers?: string[];
}

const Checkout = ({ item_identifiers }: CheckoutProps) => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    // Get identifier from URL params or use prop
    const identifier = params?.identifier as string;
    const identifiers = params?.identifiers as string;

    // Parse identifiers and create checkout items with quantities
    let itemsToCheckout: string[] = [];
    if (identifiers) {
        itemsToCheckout = identifiers.split(",");
    } else if (identifier) {
        itemsToCheckout = [identifier];
    } else {
        itemsToCheckout = item_identifiers || [];
    }

    // State for item quantities and selection
    const [itemQuantities, setItemQuantities] = useState<{
        [key: string]: number;
    }>(itemsToCheckout.reduce((acc, item) => ({ ...acc, [item]: 1 }), {}));
    const [selectedItems, setSelectedItems] = useState<{
        [key: string]: boolean;
    }>(itemsToCheckout.reduce((acc, item) => ({ ...acc, [item]: true }), {}));

    // Shipping form state
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        state: "",
    });

    const handleGoBack = () => {
        router.back();
    };

    const increaseQuantity = (item: string) => {
        const currentQuantity = itemQuantities[item] || 1;
        if (currentQuantity >= 5) {
            toast.error("Maximum 5 items allowed per product");
            return;
        }

        setItemQuantities((prev) => ({
            ...prev,
            [item]: currentQuantity + 1,
        }));
    };

    const decreaseQuantity = (item: string) => {
        setItemQuantities((prev) => ({
            ...prev,
            [item]: Math.max(1, (prev[item] || 1) - 1),
        }));
    };

    const toggleItemSelection = (item: string) => {
        const newSelectedItems = {
            ...selectedItems,
            [item]: !selectedItems[item],
        };

        // Ensure at least one item is selected
        const hasSelected = Object.values(newSelectedItems).some(
            (selected) => selected
        );
        if (hasSelected) {
            setSelectedItems(newSelectedItems);
        }
    };

    const getSelectedItems = () => {
        return itemsToCheckout.filter((item) => selectedItems[item]);
    };

    const handleCompleteOrder = () => {
        const selectedItemsList = getSelectedItems();

        // Check if at least one item is selected
        if (selectedItemsList.length === 0) {
            toast.error("Please select at least one item to checkout");
            return;
        }

        // Validate shipping info
        if (
            !shippingInfo.fullName ||
            !shippingInfo.phone ||
            !shippingInfo.address ||
            !shippingInfo.city ||
            !shippingInfo.pincode
        ) {
            toast.error("Please fill in all shipping details");
            return;
        }

        // Process order logic here
        console.log("Completing order for:", selectedItemsList);
        console.log("Item quantities:", itemQuantities);
        console.log("Shipping info:", shippingInfo);
        toast.success("Order placed successfully!");
        // Navigate to order confirmation or success page
    };

    const renderCheckoutItem = ({
        item,
        index,
    }: {
        item: string;
        index: number;
    }) => (
        <View
            style={[
                styles.checkoutItem,
                !selectedItems[item] && styles.checkoutItemDisabled,
            ]}
        >
            <View style={styles.itemMainRow}>
                {/* Product Image with Overlay Checkbox */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: `https://picsum.photos/seed/${item}/60/60`,
                        }}
                        style={styles.productImage}
                    />
                    <TouchableOpacity
                        style={styles.checkmarkOverlay}
                        onPress={() => toggleItemSelection(item)}
                    >
                        <Ionicons
                            name={
                                selectedItems[item]
                                    ? "checkmark-circle"
                                    : "ellipse-outline"
                            }
                            size={18}
                            color={selectedItems[item] ? "#fff" : "#666"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text
                        style={[
                            styles.productTitle,
                            !selectedItems[item] && styles.productTitleDisabled,
                        ]}
                    >
                        {item}
                    </Text>
                    <Text style={styles.productPrice}>₹299</Text>
                </View>

                {/* Quantity Controls */}
                <View style={styles.quantityControls}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => decreaseQuantity(item)}
                        disabled={
                            !selectedItems[item] || itemQuantities[item] <= 1
                        }
                    >
                        <Ionicons
                            name="remove"
                            size={14}
                            color={
                                !selectedItems[item] ||
                                itemQuantities[item] <= 1
                                    ? "#666"
                                    : "#000"
                            }
                        />
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.quantityText,
                            !selectedItems[item] && styles.quantityTextDisabled,
                        ]}
                    >
                        {itemQuantities[item] || 1}
                    </Text>

                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => increaseQuantity(item)}
                        disabled={
                            !selectedItems[item] || itemQuantities[item] >= 5
                        }
                    >
                        <Ionicons
                            name="add"
                            size={14}
                            color={
                                !selectedItems[item] ||
                                itemQuantities[item] >= 5
                                    ? "#666"
                                    : "#000"
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderEmptyCheckout = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={80} color="#444" />
            <Text style={styles.emptyTitle}>No items to checkout</Text>
            <Text style={styles.emptyDescription}>
                Add some items to your cart first!
            </Text>
        </View>
    );
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <TouchableOpacity
                            onPress={handleGoBack}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={30}
                                color="white"
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.headingText}>Checkout</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                {itemsToCheckout.length}{" "}
                                {itemsToCheckout.length === 1
                                    ? "item"
                                    : "items"}{" "}
                                to purchase
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={[
                        { paddingBottom: itemsToCheckout.length > 0 ? 80 : 20 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    style={styles.pageContent}
                >
                    {itemsToCheckout.length === 0 ? (
                        renderEmptyCheckout()
                    ) : (
                        <View style={styles.scrollViewContent}>
                            {/* Section 1: Order Items */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Order Summary
                                </Text>
                                <View style={styles.separator} />
                                <View style={styles.sectionContent}>
                                    <FlatList
                                        data={itemsToCheckout}
                                        keyExtractor={(item, index) =>
                                            `${item}-${index}`
                                        }
                                        renderItem={renderCheckoutItem}
                                        showsVerticalScrollIndicator={false}
                                        scrollEnabled={false}
                                    />
                                </View>
                            </View>

                            {/* Section 2: Shipping Details */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Shipping Details
                                </Text>
                                <View style={styles.separator} />
                                <View style={styles.sectionContent}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Full Name"
                                            placeholderTextColor="#646f7e"
                                            cursorColor="white"
                                            value={shippingInfo.fullName}
                                            onChangeText={(text) =>
                                                setShippingInfo({
                                                    ...shippingInfo,
                                                    fullName: text,
                                                })
                                            }
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Phone Number"
                                            placeholderTextColor="#646f7e"
                                            cursorColor="white"
                                            keyboardType="phone-pad"
                                            value={shippingInfo.phone}
                                            onChangeText={(text) =>
                                                setShippingInfo({
                                                    ...shippingInfo,
                                                    phone: text,
                                                })
                                            }
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Complete Address"
                                            placeholderTextColor="#646f7e"
                                            cursorColor="white"
                                            multiline
                                            numberOfLines={3}
                                            value={shippingInfo.address}
                                            onChangeText={(text) =>
                                                setShippingInfo({
                                                    ...shippingInfo,
                                                    address: text,
                                                })
                                            }
                                        />
                                    </View>

                                    <View style={styles.row}>
                                        <View
                                            style={[
                                                styles.inputContainer,
                                                styles.halfWidth,
                                            ]}
                                        >
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="City"
                                                placeholderTextColor="#646f7e"
                                                cursorColor="white"
                                                value={shippingInfo.city}
                                                onChangeText={(text) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        city: text,
                                                    })
                                                }
                                            />
                                        </View>

                                        <View
                                            style={[
                                                styles.inputContainer,
                                                styles.halfWidth,
                                            ]}
                                        >
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="PIN Code"
                                                placeholderTextColor="#646f7e"
                                                cursorColor="white"
                                                keyboardType="numeric"
                                                value={shippingInfo.pincode}
                                                onChangeText={(text) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        pincode: text,
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="State"
                                            placeholderTextColor="#646f7e"
                                            cursorColor="white"
                                            value={shippingInfo.state}
                                            onChangeText={(text) =>
                                                setShippingInfo({
                                                    ...shippingInfo,
                                                    state: text,
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Section 3: Payment Method */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Payment Method
                                </Text>
                                <View style={styles.separator} />
                                <View style={styles.sectionContent}>
                                    <View style={styles.paymentMethod}>
                                        <View style={styles.paymentMethodLeft}>
                                            <Ionicons
                                                name="cash-outline"
                                                size={24}
                                                color="#fff"
                                            />
                                            <View
                                                style={styles.paymentMethodText}
                                            >
                                                <Text
                                                    style={
                                                        styles.paymentMethodTitle
                                                    }
                                                >
                                                    Cash on Delivery
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.paymentMethodSubtitle
                                                    }
                                                >
                                                    Pay when you receive your
                                                    order
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.paymentMethodRight}>
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={20}
                                                color="#fff"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Sticky Checkout Button - Only when items exist */}
                {itemsToCheckout.length > 0 && (
                    <View
                        style={[
                            styles.stickyContainer,
                            { paddingBottom: Math.max(insets.bottom, 10) },
                        ]}
                    >
                        <View style={styles.stickyButtonContainer}>
                            <TouchableOpacity
                                style={styles.proceedButton}
                                onPress={handleCompleteOrder}
                            >
                                <Ionicons
                                    name="bag-check-outline"
                                    size={20}
                                    color="#000"
                                />
                                <Text style={styles.proceedButtonText}>
                                    Complete Order ({getSelectedItems().length}{" "}
                                    items)
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Checkout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
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
    backButton: {
        padding: 5,
    },
    headingText: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        color: "#fff",
    },
    mainSubHeaddingText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#646f7e",
    },
    pageContent: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
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
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "#646f7e",
        marginBottom: 15,
    },
    sectionContent: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    checkoutItem: {
        paddingVertical: 6,
        paddingHorizontal: 0,
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    checkoutItemDisabled: {
        opacity: 0.5,
    },
    itemMainRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    itemSelection: {
        paddingRight: 4,
    },
    imageContainer: {
        position: "relative",
        marginRight: 4,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#333",
    },
    checkmarkOverlay: {
        position: "absolute",
        top: -2,
        left: -2,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 12,
        padding: 2,
    },
    productInfo: {
        flex: 1,
        gap: 4,
    },
    productTitle: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "SfProMedium",
        lineHeight: 18,
    },
    productTitleDisabled: {
        color: "#666",
    },
    productPrice: {
        fontSize: 12,
        color: "#007AFF",
        fontFamily: "SfProMedium",
        fontWeight: "600",
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    quantityButton: {
        backgroundColor: "white",
        borderRadius: 4,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    quantityText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        fontFamily: "SfProMedium",
        minWidth: 20,
        textAlign: "center",
    },
    quantityTextDisabled: {
        color: "#666",
    },
    inputContainer: {
        marginBottom: 16,
    },
    textInput: {
        borderBottomColor: "#646f7e",
        borderBottomWidth: 1,
        height: 35,
        padding: 8,
        color: "white",
        fontSize: 14,
        fontFamily: "SfProMedium",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    paymentMethod: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    paymentMethodLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    paymentMethodText: {
        flex: 1,
    },
    paymentMethodRight: {
        paddingLeft: 12,
    },
    paymentMethodTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        lineHeight: 20,
    },
    paymentMethodSubtitle: {
        color: "#646f7e",
        fontSize: 12,
        marginTop: 2,
        fontFamily: "SfProMedium",
    },
    stickyContainer: {
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
    stickyButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    proceedButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    proceedButtonText: {
        marginLeft: 8,
        fontWeight: "bold",
        color: "#000",
        fontSize: 14,
        fontFamily: "SfProMedium",
    },
});
