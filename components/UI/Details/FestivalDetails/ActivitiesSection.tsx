/**
 * ActivitiesSection Component
 * Author: SomnathChW
 * Created: 2025-08-09
 *
 * This component renders activities and events information for festivals.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ActivitiesSectionProps {
    activities?: string[];
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
    activities,
}) => {
    // Don't render if no activities provided
    if (!activities || activities.length === 0) {
        return null;
    }

    return (
        <View style={styles.sectionContainer}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Festival Activities</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Activities List */}
            <View style={styles.activitiesContainer}>
                {activities.map((activity, index) => (
                    <View key={index} style={styles.activityItem}>
                        <View style={styles.bulletContainer}>
                            <MaterialCommunityIcons
                                name="star-four-points"
                                size={16}
                                color="#646f7e"
                            />
                        </View>
                        <Text style={styles.activityText}>{activity}</Text>
                    </View>
                ))}
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
    activitiesContainer: {
        backgroundColor: "rgba(100, 111, 126, 0.08)",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
        marginBottom: 12,
    },
    activityItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    bulletContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    activityText: {
        color: "#FFFFFF",
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
        textTransform: "capitalize",
    },
});

export default ActivitiesSection;
