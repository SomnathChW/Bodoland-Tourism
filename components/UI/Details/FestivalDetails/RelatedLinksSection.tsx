/**
 * RelatedLinksSection Component
 * Author: SomnathChW
 * Created: 2025-08                        <View style={styles.linkTextContainer}>
                            <Text style={styles.linkTitle}>{link.label}</Text>
                            <Text style={styles.linkDescription}>
                                Learn more about this festival topic
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#ffffff"
                        />his component renders related links and external resources for festivals.
 */

import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

interface RelatedLink {
    label: string;
    url: string;
}

interface RelatedLinksSectionProps {
    relatedLinks?: RelatedLink[];
}

const RelatedLinksSection: React.FC<RelatedLinksSectionProps> = ({
    relatedLinks,
}) => {
    // Don't render if no related links provided
    if (!relatedLinks || relatedLinks.length === 0) {
        return null;
    }

    const handleLinkPress = async (url: string) => {
        try {
            // Ensure URL has proper protocol
            let formattedUrl = url;
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                formattedUrl = `https://${url}`;
            }

            await Linking.openURL(formattedUrl);
        } catch (error) {
            console.error("Error opening URL:", error);
        }
    };

    return (
        <View style={styles.sectionContainer}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Learn More</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Links */}
            {relatedLinks.map((link, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.linkCard,
                        index === relatedLinks.length - 1 && {
                            marginBottom: 0,
                        },
                    ]}
                    onPress={() => handleLinkPress(link.url)}
                    activeOpacity={0.7}
                >
                    <View style={styles.linkContent}>
                        <View style={styles.linkIconContainer}>
                            <MaterialCommunityIcons
                                name="open-in-new"
                                size={24}
                                color="#ffffff"
                            />
                        </View>
                        <View style={styles.linkTextContainer}>
                            <Text style={styles.linkTitle}>{link.label}</Text>
                            <Text style={styles.linkDescription}>
                                Tap to view more information
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#646f7e"
                        />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
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
    linkCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
        marginBottom: 8,
        overflow: "hidden",
    },
    linkContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    linkIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(100,111,126,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    linkTextContainer: {
        flex: 1,
    },
    linkTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 4,
        fontFamily: "SfProMedium",
    },
    linkDescription: {
        fontSize: 12,
        color: "#646f7e",
        opacity: 1,
        fontFamily: "SfProMedium",
    },
});

export default RelatedLinksSection;
