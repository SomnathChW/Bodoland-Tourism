/**
 * CulturalSignificanceSection Component
 * Author: SomnathChW
 * Created: 2025-08-09
 *
 * This component renders cultural significance information for festivals.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CulturalSignificanceSectionProps {
    culturalSignificance?: string;
}

const CulturalSignificanceSection: React.FC<
    CulturalSignificanceSectionProps
> = ({ culturalSignificance }) => {
    // Don't render if no cultural significance provided
    if (!culturalSignificance) {
        return null;
    }

    return (
        <View style={styles.sectionContainer}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Cultural Significance</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Cultural Significance Content */}
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name="book-open-variant"
                        size={24}
                        color="#646f7e"
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.significanceText}>
                        {culturalSignificance}
                    </Text>
                </View>
            </View>
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "rgba(100, 111, 126, 0.2)",
        marginBottom: 15,
        width: "100%",
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(100, 111, 126, 0.08)",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(100,111,126,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    significanceText: {
        color: "#FFFFFF",
        fontSize: 14,
        lineHeight: 22,
        textAlign: "justify",
    },
});

export default CulturalSignificanceSection;
