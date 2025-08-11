/**
 * ActivitiesSection Component
 * Author: SomnathChW
 * Created: 2025-08-09
 *
 * This component renders activities and events information for festivals.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

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
            <View style={styles.activitiesCard}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons
                        name="star-four-points"
                        size={18}
                        color="#ffffff"
                    />
                    <Text style={styles.cardHeaderText}>
                        Activities & Events
                    </Text>
                </View>
                {activities.map((activity, index) => (
                    <View
                        key={index}
                        style={[
                            styles.activityRow,
                            index === activities.length - 1 && {
                                marginBottom: 0,
                            },
                        ]}
                    >
                        <View style={styles.activityBullet}>
                            <MaterialCommunityIcons
                                name="star-four-points"
                                size={12}
                                color="#646f7e"
                            />
                        </View>
                        <Text style={styles.activityText}>{activity}</Text>
                    </View>
                ))}

                {/* Note */}
                <View style={styles.noteContainer}>
                    <Ionicons
                        name="information-circle-outline"
                        size={12}
                        color="#646f7e"
                    />
                    <Text style={styles.noteText}>
                        Activities may vary by location and year - confirm with
                        local organizers
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
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "#646f7e",
        marginBottom: 15,
    },
    activitiesCard: {
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
    activityRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    activityBullet: {
        marginRight: 8,
        marginTop: 2,
    },
    activityText: {
        color: "#FFFFFF",
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
        textTransform: "capitalize",
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

export default ActivitiesSection;
