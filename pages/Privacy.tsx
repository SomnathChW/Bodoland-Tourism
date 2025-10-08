import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView,
    Linking,
    Alert,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/UI/PageHeader/Header";
import { TouchableOpacity } from "react-native";
import colors from "@/constants/colors";

const Privacy = () => {
    const insets = useSafeAreaInsets();

    const handleEmailContact = () => {
        const email = "support@bodoland.coolidaance.com";
        const subject = "Support Request - Bodoland Tourism";
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
            subject
        )}`;

        Linking.openURL(mailtoUrl).catch(() => {
            Alert.alert(
                "Email Client Not Found",
                `Please send your queries to: ${email}`,
                [{ text: "OK" }]
            );
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                headingText="Privacy & Returns Policy"
                subHeadingText="Your privacy and satisfaction matter to us"
            />

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View
                    style={[
                        styles.section,
                        { marginTop: 25, marginBottom: 10 },
                    ]}
                >
                    <Text style={styles.lastUpdated}>
                        Last updated: October 8, 2025
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>Data Collection</Text>
                    <Text style={styles.content}>
                        We are committed to protecting your privacy. Our data
                        collection is minimal and transparent:
                    </Text>
                    <Text style={styles.bulletPoint}>
                        •{" "}
                        <Text style={styles.bold}>Email & Password Login:</Text>{" "}
                        We only collect your email address and name when you
                        create an account using email and password.
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • <Text style={styles.bold}>Google Login:</Text> When
                        you use Google Sign-In, Google's privacy policy applies.
                        We receive only basic profile information (name, email)
                        as permitted by Google.
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • <Text style={styles.bold}>Order Information:</Text>{" "}
                        When you purchase souvenirs through our app, we collect
                        necessary order details including shipping address and
                        payment information for order fulfillment only.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>What We Don't Monitor</Text>
                    <Text style={styles.content}>
                        We respect your privacy and do not monitor or collect:
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Your browsing behavior within the app
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Your location data (unless explicitly granted for map
                        features)
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Your device information beyond basic compatibility
                        requirements
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Your personal conversations or communications
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>Data Usage</Text>
                    <Text style={styles.content}>
                        Your data is used solely for:
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Providing you access to the Bodoland Tourism app
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Processing and fulfilling souvenir orders
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Providing customer support
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Sending order updates and confirmations
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>Data Sharing</Text>
                    <Text style={styles.content}>
                        We do not sell, trade, or share your personal
                        information with third parties except:
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • With shipping partners for order delivery (address
                        only)
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • With payment processors for secure transactions
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • When required by law or to protect our rights
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Returns & Refund Policy
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>Eligible Returns</Text>
                    <Text style={styles.content}>
                        We accept returns for non-food items on a case-by-case
                        basis for genuine reasons including:
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Items received in damaged or broken condition
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Significantly poor quality that doesn't match
                        description
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Wrong item sent (our error)
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Manufacturing defects
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>Non-Eligible Returns</Text>
                    <Text style={styles.content}>
                        Returns will not be accepted for:
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Food items and perishables
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Change of mind ("I don't want it anymore")
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Items damaged due to misuse
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Items returned after 30 days of delivery
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>Return Process</Text>
                    <Text style={styles.content}>To initiate a return:</Text>
                    <Text style={styles.bulletPoint}>
                        • Contact us within 7 days of delivery
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Provide order details and reason for return
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Include photos if item is damaged
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • We'll review and approve eligible returns
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Return shipping instructions will be provided
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>Refunds & Replacements</Text>
                    <Text style={styles.content}>Upon approval:</Text>
                    <Text style={styles.bulletPoint}>
                        • Refunds processed within 5-7 business days
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Replacements sent within 3-5 business days
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Customer choice between refund or replacement
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • Return shipping costs covered for our errors
                    </Text>
                </View>

                <View style={styles.contactSection}>
                    <Text style={styles.subTitle}>Need Help?</Text>
                    <Text style={styles.content}>
                        For any privacy concerns or return requests, please
                        contact our support team:
                    </Text>

                    <TouchableOpacity
                        style={styles.emailButton}
                        onPress={handleEmailContact}
                    >
                        <Text style={styles.emailButtonText}>
                            Contact Support
                        </Text>
                        <Text style={styles.emailText}>
                            support@bodoland.coolidaance.com
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.footerText}>
                        This policy may be updated periodically. Continued use
                        of the app constitutes acceptance of any changes.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default Privacy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: "transparent",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 5,
        fontFamily: "SF-Pro-Display-Bold",
    },
    subTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "white",
        marginBottom: 12,
        fontFamily: "SF-Pro-Display-Semibold",
    },
    content: {
        fontSize: 16,
        color: "#646f7e",
        lineHeight: 24,
        marginBottom: 12,
        fontFamily: "SF-Pro-Display-Regular",
    },
    bulletPoint: {
        fontSize: 15,
        color: "#646f7e",
        lineHeight: 22,
        marginBottom: 8,
        marginLeft: 10,
        fontFamily: "SF-Pro-Display-Regular",
    },
    bold: {
        fontWeight: "600",
        color: "white",
        fontFamily: "SF-Pro-Display-Semibold",
    },
    lastUpdated: {
        fontSize: 14,
        color: "#646f7e",
        fontStyle: "italic",
        fontFamily: "SF-Pro-Display-Regular",
    },
    divider: {
        height: 2,
        backgroundColor: "#646f7e",
        marginVertical: 30,
        marginHorizontal: 0,
    },
    contactSection: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 20,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: "#2c3440",
    },
    emailButton: {
        backgroundColor: "#646f7e",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginTop: 15,
        elevation: 3,
        shadowColor: "#646f7e",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    emailButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "SF-Pro-Display-Semibold",
        marginBottom: 4,
    },
    emailText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 14,
        fontFamily: "SF-Pro-Display-Regular",
    },
    footerText: {
        fontSize: 14,
        color: "#646f7e",
        textAlign: "center",
        lineHeight: 20,
        marginTop: 20,
        fontStyle: "italic",
        fontFamily: "SF-Pro-Display-Regular",
    },
});
