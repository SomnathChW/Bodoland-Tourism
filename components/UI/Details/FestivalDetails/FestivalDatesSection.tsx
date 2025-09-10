/**
 * FestivalDatesSection Component
 * Author: SomnathChW
 * Created: 2025-08-09
 *
 * This component renders festival date information with proper formatting.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

interface FestivalDatesSectionProps {
    dates?: {
        general?: string;
        exact?: {
            start: string;
            end: string;
        };
    };
}

const FestivalDatesSection: React.FC<FestivalDatesSectionProps> = ({
    dates,
}) => {
    // Don't render if no dates provided
    if (!dates) {
        return null;
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return dateString;
        }
    };

    const getDateText = () => {
        if (dates.exact) {
            const startDate = formatDate(dates.exact.start);
            const endDate = formatDate(dates.exact.end);

            if (dates.exact.start === dates.exact.end) {
                return startDate;
            }
            return `${startDate} - ${endDate}`;
        }

        if (dates.general) {
            return dates.general;
        }

        return null;
    };

    const dateText = getDateText();

    // Don't render if no valid date text
    if (!dateText) {
        return null;
    }

    return (
        <Animated.View
            style={styles.sectionContainer}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Festival Dates</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Date Information */}
            <View style={styles.dateCard}>
                <View style={styles.cardHeader}>
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#ffffff"
                    />
                    <Text style={styles.cardHeaderText}>Date Information</Text>
                </View>
                <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>Date:</Text>
                    <Text style={styles.dateText}>{dateText}</Text>
                </View>
                {(dates.exact || (dates.general && !dates.exact)) && (
                    <View style={styles.noteContainer}>
                        <Ionicons
                            name="information-circle-outline"
                            size={12}
                            color="#646f7e"
                        />
                        <Text style={styles.noteText}>
                            {dates.exact
                                ? "Exact celebration dates confirmed"
                                : "General celebration period - check local sources for specific dates"}
                        </Text>
                    </View>
                )}
            </View>
        </Animated.View>
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
    dateCard: {
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
    dateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    dateLabel: {
        color: "#ffffff",
        fontSize: 14,
        fontFamily: "SfProMedium",
        fontWeight: "500",
    },
    dateText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
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

export default FestivalDatesSection;
