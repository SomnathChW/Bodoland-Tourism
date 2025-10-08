import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/UI/PageHeader/Header";
import { useDataStore } from "@/store/useDataStore";
import * as SecureStore from "expo-secure-store";

const Orders = () => {
    const insets = useSafeAreaInsets();
    const { orders, setData } = useDataStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const ordersString = await SecureStore.getItemAsync("orders");
            if (ordersString) {
                const ordersArray = JSON.parse(ordersString);
                setData({ orders: ordersArray });
            }
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "#FFA500";
            case "confirmed":
                return "#4CAF50";
            case "delivered":
                return "#2196F3";
            case "cancelled":
                return "#F44336";
            default:
                return "#8E8E93";
        }
    };

    const renderOrderItem = ({ item }: { item: any }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.orderDate}>
                        {formatDate(item.createdAt)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) + "20" },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: getStatusColor(item.status) },
                        ]}
                    >
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.orderDivider} />

            <View style={styles.orderContent}>
                <View style={styles.orderSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="bag-outline" size={16} color="#fff" />
                        <Text style={styles.sectionTitle}>
                            Items ({item.items.length})
                        </Text>
                    </View>
                    {item.items.map((orderItem: any, index: number) => (
                        <View key={index} style={styles.itemRow}>
                            {orderItem.image && (
                                <Image
                                    source={{ uri: orderItem.image }}
                                    style={styles.itemImage}
                                />
                            )}
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemName}>
                                    {orderItem.name || orderItem.identifier}
                                </Text>
                                <Text style={styles.itemDetails}>
                                    Qty: {orderItem.quantity} × ₹
                                    {orderItem.price}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.orderSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color="#fff"
                        />
                        <Text style={styles.sectionTitle}>
                            Shipping Address
                        </Text>
                    </View>
                    <Text style={styles.addressText}>
                        {item.shippingInfo.fullName}
                    </Text>
                    <Text style={styles.addressText}>
                        {item.shippingInfo.address}
                    </Text>
                    <Text style={styles.addressText}>
                        {item.shippingInfo.city}, {item.shippingInfo.state} -{" "}
                        {item.shippingInfo.pincode}
                    </Text>
                    <Text style={styles.addressText}>
                        Ph: {item.shippingInfo.phone}
                    </Text>
                </View>

                <View style={styles.orderSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="card-outline" size={16} color="#fff" />
                        <Text style={styles.sectionTitle}>Payment</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Method:</Text>
                        <Text style={styles.paymentValue}>
                            {item.paymentMethod}
                        </Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Total Amount:</Text>
                        <Text style={styles.totalAmount}>
                            ₹{item.totalAmount}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderEmptyOrders = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#444" />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyDescription}>
                Your order history will appear here once you make a purchase.
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                headingText="Your Orders"
                subHeadingText={
                    orders.length > 0
                        ? `${orders.length} ${
                              orders.length === 1 ? "order" : "orders"
                          }`
                        : "No orders yet"
                }
            />

            <View style={styles.pageContent}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>
                            Loading orders...
                        </Text>
                    </View>
                ) : orders.length === 0 ? (
                    renderEmptyOrders()
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id}
                        renderItem={renderOrderItem}
                        contentContainerStyle={styles.ordersList}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

export default Orders;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    pageContent: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#8E8E93",
        fontSize: 16,
        fontFamily: "SfProMedium",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginTop: 20,
        marginBottom: 10,
        fontFamily: "SfProMedium",
    },
    emptyDescription: {
        fontSize: 16,
        color: "#8E8E93",
        textAlign: "center",
        lineHeight: 24,
        fontFamily: "SfProMedium",
    },
    ordersList: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    orderCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    orderHeaderLeft: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
        fontFamily: "SfProMedium",
    },
    orderDate: {
        fontSize: 12,
        color: "#8E8E93",
        fontFamily: "SfProMedium",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
    },
    orderDivider: {
        height: 1,
        backgroundColor: "#333",
        marginBottom: 12,
    },
    orderContent: {
        gap: 16,
    },
    orderSection: {
        gap: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#646f7e",
        fontFamily: "SfProMedium",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 24,
        gap: 12,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#333",
    },
    itemTextContainer: {
        flex: 1,
        gap: 4,
    },
    itemName: {
        fontSize: 14,
        color: "#fff",
        flex: 1,
        fontFamily: "SfProMedium",
    },
    itemDetails: {
        fontSize: 12,
        color: "#8E8E93",
        fontFamily: "SfProMedium",
    },
    addressText: {
        fontSize: 14,
        color: "#fff",
        lineHeight: 20,
        paddingLeft: 24,
        fontFamily: "SfProMedium",
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 24,
    },
    paymentLabel: {
        fontSize: 14,
        color: "#8E8E93",
        fontFamily: "SfProMedium",
    },
    paymentValue: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "SfProMedium",
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
        fontFamily: "SfProMedium",
    },
});
