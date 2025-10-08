/**
 * ContactSection Component for Stays
 * Author: SomnathChW
 * Created: 2025-10-04
 *
 * This component renders contact information including phone and website
 */

import React, { useState } from "react";
import { StyleSheet, Text, View, Linking, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import AlertDialog from "@/components/UI/AlertDialog";

interface ContactSectionProps {
    contactNumber?: string;
    website?: string;
    name?: string;
}

/**
 * ContactSection renders contact information with call and website buttons
 */
export const ContactSection: React.FC<ContactSectionProps> = ({
    contactNumber,
    website,
    name = "this property",
}) => {
    const [dialogVisible, setDialogVisible] = useState(false);

    // Don't render if no contact info
    if (!contactNumber && !website) {
        return null;
    }

    const handleCall = () => {
        if (contactNumber) {
            const phoneNumber = contactNumber.replace(/\s+/g, "");
            Linking.openURL(`tel:${phoneNumber}`);
        }
        setDialogVisible(false);
    };

    const handleWebsite = () => {
        if (website) {
            Linking.openURL(website);
        }
        setDialogVisible(false);
    };

    const handleContactPress = () => {
        // If only one option is available, open it directly
        if (contactNumber && !website) {
            handleCall();
            return;
        }
        if (website && !contactNumber) {
            handleWebsite();
            return;
        }
        // If both are available, show dialog
        setDialogVisible(true);
    };

    return (
        <>
            <Animated.View
                style={styles.contactSection}
                entering={FadeIn.duration(300)}
            >
                {/* Section Title */}
                <Text style={styles.sectionTitle}>Contact Information</Text>

                {/* Separator Line */}
                <View style={styles.separator} />

                {/* Contact Details */}
                <View style={styles.contactContainer}>
                    {contactNumber && (
                        <View style={styles.contactItem}>
                            <Ionicons
                                name="call-outline"
                                size={18}
                                color="#646f7e"
                            />
                            <View style={styles.contactTextContainer}>
                                <Text style={styles.contactLabel}>Phone</Text>
                                <Text style={styles.contactValue}>
                                    {contactNumber}
                                </Text>
                            </View>
                        </View>
                    )}

                    {website && (
                        <View style={styles.contactItem}>
                            <Ionicons
                                name="globe-outline"
                                size={18}
                                color="#646f7e"
                            />
                            <View style={styles.contactTextContainer}>
                                <Text style={styles.contactLabel}>Website</Text>
                                <Text
                                    style={styles.contactValue}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {website}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Contact Button */}
                <Pressable
                    style={styles.contactButton}
                    onPress={handleContactPress}
                >
                    <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={18}
                        color="#0d1116"
                    />
                    <Text style={styles.contactButtonText}>Contact</Text>
                </Pressable>
            </Animated.View>

            {/* Alert Dialog for multiple contact options */}
            <AlertDialog
                visible={dialogVisible}
                title="Contact Options"
                description={`How would you like to contact ${name}?`}
                buttons={[
                    {
                        text: "Cancel",
                        onPress: () => setDialogVisible(false),
                        type: "cancel",
                    },
                    {
                        text: "Call",
                        onPress: handleCall,
                        type: "secondary",
                        disabled: !contactNumber,
                    },
                    {
                        text: "Website",
                        onPress: handleWebsite,
                        type: "primary",
                        disabled: !website,
                    },
                ]}
                onCancel={() => setDialogVisible(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    contactSection: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "#646f7e",
        marginBottom: 15,
    },
    contactContainer: {
        gap: 12,
        marginBottom: 15,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#1a1f26",
        borderRadius: 8,
        padding: 12,
    },
    contactTextContainer: {
        flex: 1,
    },
    contactLabel: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginBottom: 2,
    },
    contactValue: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 14,
    },
    contactButton: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 8,
    },
    contactButtonText: {
        color: "#0d1116",
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default React.memo(ContactSection);
