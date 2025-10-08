import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    Linking,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/UI/PageHeader/Header";
import { Ionicons } from "@expo/vector-icons";

interface HelpItem {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    content: string;
    hasContact?: boolean;
    contactInfo?: {
        phone?: string;
        email?: string;
    };
}

const Help = () => {
    const insets = useSafeAreaInsets();
    const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const helpItems: HelpItem[] = [
        {
            id: "returns",
            title: "How do I return an item?",
            description: "Learn about our return process and policies",
            icon: "return-up-back-outline",
            content:
                "To return an item from your souvenir purchase:\n\n1. Contact our support team within 7 days of delivery\n2. Provide your order number and reason for return\n3. Include photos if the item is damaged or defective\n4. We'll review your request within 24 hours\n5. If approved, we'll provide return shipping instructions\n6. Once we receive the item, refunds are processed within 5-7 business days\n\nNote: Only non-food items are eligible for return. Returns are accepted for genuine reasons like damage, poor quality, or our shipping errors.",
            hasContact: true,
            contactInfo: {
                email: "support@bodoland.coolidaance.com",
                phone: "+91 98765 43210",
            },
        },
        {
            id: "booking",
            title: "How do I book a stay?",
            description: "Step-by-step guide to booking accommodations",
            icon: "bed-outline",
            content:
                "Currently, our app provides information about various stays and accommodations in Bodoland. To book a stay:\n\n1. Browse through the 'Stays' section in the app\n2. Select the accommodation that interests you\n3. View details, amenities, and pricing information\n4. Use the contact information provided for each stay\n5. Call or visit their website directly to make a booking\n6. Confirm availability and rates with the property\n\nWe're working on integrating direct booking functionality. For now, all bookings are handled directly by the accommodation providers.",
            hasContact: true,
            contactInfo: {
                email: "support@bodoland.coolidaance.com",
            },
        },
        {
            id: "account",
            title: "Managing my account",
            description: "Learn how to update your profile and settings",
            icon: "person-circle-outline",
            content:
                "To manage your account:\n\n1. Go to the Profile section from the main menu\n2. Update your personal information as needed\n3. Change your password from the settings\n4. Manage your notification preferences\n5. View your order history in the 'My Orders' section\n6. Sign out safely when done\n\nIf you're using Google Sign-In, some information is managed through your Google account. Contact support if you need help with account-related issues.",
            hasContact: true,
            contactInfo: {
                email: "support@bodoland.coolidaance.com",
            },
        },
        {
            id: "navigation",
            title: "Using the app navigation",
            description: "Get familiar with app features and navigation",
            icon: "map-outline",
            content:
                "Navigate the Bodoland Tourism app easily:\n\n1. Use the side menu (☰) to access all main sections\n2. Explore Attractions, Stays, Cuisines, and more\n3. Use the search function to find specific places\n4. Tap on any item to view detailed information\n5. Access maps and directions for locations\n6. Browse virtual tours where available\n7. Check out the Souvenirs section for local products\n\nEach section provides detailed information about Bodoland's rich culture and tourism opportunities.",
            hasContact: false,
        },
        {
            id: "payments",
            title: "Payment and orders",
            description: "Information about payments and order tracking",
            icon: "card-outline",
            content:
                "For souvenir purchases:\n\n1. Add items to your cart from the Souvenirs section\n2. Review your order before checkout\n3. Choose from available payment methods\n4. Complete the secure payment process\n5. Receive order confirmation via email\n6. Track your order status in 'My Orders'\n7. Contact support for any payment issues\n\nWe use secure payment gateways to protect your financial information. All transactions are encrypted and safe.",
            hasContact: true,
            contactInfo: {
                email: "support@bodoland.coolidaance.com",
                phone: "+91 98765 43210",
            },
        },
    ];

    const handleItemPress = (item: HelpItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleContact = (type: "phone" | "email") => {
        if (!selectedItem?.contactInfo) return;

        if (type === "phone" && selectedItem.contactInfo.phone) {
            const phoneNumber = selectedItem.contactInfo.phone.replace(
                /\s+/g,
                ""
            );
            Linking.openURL(`tel:${phoneNumber}`);
        } else if (type === "email" && selectedItem.contactInfo.email) {
            const subject = `Help Request: ${selectedItem.title}`;
            const mailtoUrl = `mailto:${
                selectedItem.contactInfo.email
            }?subject=${encodeURIComponent(subject)}`;

            Linking.openURL(mailtoUrl).catch(() => {
                Alert.alert(
                    "Email Client Not Found",
                    `Please send your queries to: ${selectedItem.contactInfo?.email}`,
                    [{ text: "OK" }]
                );
            });
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                headingText="Help & Support"
                subHeadingText="Find answers to common questions"
            />

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {helpItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.helpItem}
                        onPress={() => handleItemPress(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.helpItemIcon}>
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color="#646f7e"
                            />
                        </View>
                        <View style={styles.helpItemContent}>
                            <Text style={styles.helpItemTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.helpItemDescription}>
                                {item.description}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#646f7e"
                        />
                    </TouchableOpacity>
                ))}

                <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <Text style={styles.contactDescription}>
                        Can't find what you're looking for? Our support team is
                        here to help.
                    </Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => handleContact("email")}
                    >
                        <Ionicons name="mail-outline" size={18} color="white" />
                        <Text style={styles.contactButtonText}>
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Help Item Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContainer,
                            { paddingBottom: insets.bottom },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedItem?.title}
                            </Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.modalContent}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalScrollContent}
                        >
                            <Text style={styles.modalText}>
                                {selectedItem?.content}
                            </Text>

                            {selectedItem?.hasContact &&
                                selectedItem?.contactInfo && (
                                    <View style={styles.modalContactSection}>
                                        <Text style={styles.modalContactTitle}>
                                            Need more help?
                                        </Text>

                                        {selectedItem.contactInfo.email && (
                                            <TouchableOpacity
                                                style={
                                                    styles.modalContactButton
                                                }
                                                onPress={() =>
                                                    handleContact("email")
                                                }
                                            >
                                                <Ionicons
                                                    name="mail-outline"
                                                    size={18}
                                                    color="#646f7e"
                                                />
                                                <Text
                                                    style={
                                                        styles.modalContactButtonText
                                                    }
                                                >
                                                    {
                                                        selectedItem.contactInfo
                                                            .email
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        )}

                                        {selectedItem.contactInfo.phone && (
                                            <TouchableOpacity
                                                style={
                                                    styles.modalContactButton
                                                }
                                                onPress={() =>
                                                    handleContact("phone")
                                                }
                                            >
                                                <Ionicons
                                                    name="call-outline"
                                                    size={18}
                                                    color="#646f7e"
                                                />
                                                <Text
                                                    style={
                                                        styles.modalContactButtonText
                                                    }
                                                >
                                                    {
                                                        selectedItem.contactInfo
                                                            .phone
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Help;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: "transparent",
        paddingTop: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    helpItem: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2c3440",
    },
    helpItemIcon: {
        width: 50,
        height: 50,
        backgroundColor: "rgba(100, 111, 126, 0.1)",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    helpItemContent: {
        flex: 1,
    },
    helpItemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        marginBottom: 4,
        fontFamily: "SF-Pro-Display-Semibold",
    },
    helpItemDescription: {
        fontSize: 14,
        color: "#646f7e",
        lineHeight: 20,
        fontFamily: "SF-Pro-Display-Regular",
    },
    contactSection: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#2c3440",
        alignItems: "center",
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
        marginBottom: 8,
        fontFamily: "SF-Pro-Display-Semibold",
    },
    contactDescription: {
        fontSize: 14,
        color: "#646f7e",
        textAlign: "center",
        marginBottom: 15,
        lineHeight: 20,
        fontFamily: "SF-Pro-Display-Regular",
    },
    contactButton: {
        backgroundColor: "#646f7e",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    contactButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "SF-Pro-Display-Semibold",
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#1a2029",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
        minHeight: "50%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2c3440",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
        flex: 1,
        marginRight: 15,
        fontFamily: "SF-Pro-Display-Semibold",
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    modalScrollContent: {
        paddingBottom: 20,
    },
    modalText: {
        fontSize: 15,
        color: "#646f7e",
        lineHeight: 24,
        fontFamily: "SF-Pro-Display-Regular",
    },
    modalContactSection: {
        marginTop: 25,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#2c3440",
    },
    modalContactTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        marginBottom: 15,
        fontFamily: "SF-Pro-Display-Semibold",
    },
    modalContactButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(100, 111, 126, 0.1)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        gap: 10,
    },
    modalContactButtonText: {
        color: "#646f7e",
        fontSize: 14,
        fontFamily: "SF-Pro-Display-Regular",
    },
});
