/**
 * FestivalDatesSection Component
 * Author: SomnathChW
 * Created: 2025-08-09
 *
 * This component renders festival date information with proper formatting.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        <View style={styles.sectionContainer}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Festival Dates</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Date Information */}
            <View style={styles.dateContainer}>
                <View style={styles.dateRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#646f7e"
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.dateText}>{dateText}</Text>
                        {dates.exact && (
                            <Text style={styles.dateTypeText}>
                                Exact celebration dates
                            </Text>
                        )}
                        {dates.general && !dates.exact && (
                            <Text style={styles.dateTypeText}>
                                General celebration period
                            </Text>
                        )}
                    </View>
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
    dateContainer: {
        backgroundColor: "rgba(100, 111, 126, 0.1)",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
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
    dateText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
        fontFamily: "SfProMedium",
    },
    dateTypeText: {
        color: "#646f7e",
        fontSize: 12,
        fontStyle: "italic",
    },
});

export default FestivalDatesSection;
