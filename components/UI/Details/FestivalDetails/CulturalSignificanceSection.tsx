/**
 * CulturalSignificanceSection Component
 * Author: SomnathChW
 * Created: 2025-08-09
 *
 * This component renders cultural significance information for festivals.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

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
            <View style={styles.significanceCard}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons
                        name="book-open-variant"
                        size={18}
                        color="#ffffff"
                    />
                    <Text style={styles.cardHeaderText}>Cultural Context</Text>
                </View>
                <Text style={styles.significanceText}>
                    {culturalSignificance}
                </Text>
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
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "#646f7e",
        marginBottom: 15,
    },
    significanceCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        paddingBottom: 8,
        marginBottom: 8,
    },
    cardHeaderText: {
        color: "#ffffff",
        fontFamily: "SfProMedium",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 8,
    },
    significanceText: {
        color: "#FFFFFF",
        fontSize: 14,
        lineHeight: 22,
        textAlign: "justify",
    },
    noteContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: 6,
        borderRadius: 6,
    },
    noteText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginLeft: 5,
        flex: 1,
    },
});

export default CulturalSignificanceSection;
