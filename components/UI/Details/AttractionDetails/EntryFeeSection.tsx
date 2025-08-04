/**
 * EntryFeeSection Component
 * Author: SomnathChW
 * Created: 2025-07-09
 *
 * This component renders detailed entry fee information for attractions
 * with separate pricing for adults and children when applicable.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface EntryFeeProps {
    fees?: {
        adult?: string;
        child?: string;
    };
    currency?: string;
    timings?: {
        hours?: string;
        days?: string;
    };
}

const EntryFeeSection: React.FC<EntryFeeProps> = ({
    fees,
    currency = "₹",
    timings = {
        hours: "6:00 AM - 6:00 PM",
        days: "All days",
    },
}) => {
    return (
        <Animated.View
            style={styles.entryFeeSection}
            entering={FadeIn.duration(600).delay(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>
                Entry & Visiting Information
            </Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Entry Fee Card */}
            <View style={styles.feeCard}>
                <View style={styles.cardHeader}>
                    <Ionicons name="ticket-outline" size={18} color="#ffffff" />
                    <Text style={styles.cardHeaderText}>Entry Fees</Text>
                </View>

                {!fees && (
                    <View style={styles.feeRow}>
                        <Text style={styles.noFeeText}>
                            No entry fee - Applies to all visitors
                        </Text>
                    </View>
                )}

                {/* Adult Fee */}
                {fees?.adult && (
                    <View style={styles.feeRow}>
                        <View style={styles.feeTypeContainer}>
                            <Ionicons name="person" size={16} color="#ffffff" />
                            <Text style={styles.feeType}>Adult</Text>
                        </View>
                        <Text
                            style={[
                                styles.feeAmount,
                                fees.adult === "Free" && styles.freeTag,
                            ]}
                        >
                            {fees.adult === "Free"
                                ? "Free"
                                : `${currency}${fees.adult}`}
                        </Text>
                    </View>
                )}

                {/* Child Fee if exists */}
                {fees?.child && (
                    <View style={styles.feeRow}>
                        <View style={styles.feeTypeContainer}>
                            <Ionicons
                                name="person-outline"
                                size={14}
                                color="#ffffff"
                            />
                            <Text style={styles.feeType}>Child</Text>
                        </View>
                        <Text
                            style={[
                                styles.feeAmount,
                                fees.child === "Free" && styles.freeTag,
                            ]}
                        >
                            {fees.child === "Free"
                                ? "Free"
                                : `${currency}${fees.child}`}
                        </Text>
                    </View>
                )}

                {/* Note */}
                <View style={styles.noteContainer}>
                    <Ionicons
                        name="information-circle-outline"
                        size={12}
                        color="#646f7e"
                    />
                    <Text style={styles.noteText}>
                        Prices may vary based on season and special events
                    </Text>
                </View>
            </View>

            {/* Timing Card */}
            <View style={styles.feeCard}>
                <View style={styles.cardHeader}>
                    <Ionicons name="time-outline" size={18} color="#ffffff" />
                    <Text style={styles.cardHeaderText}>
                        Timing Information
                    </Text>
                </View>

                {/* Opening Hours */}
                <View style={styles.feeRow}>
                    <View style={styles.feeTypeContainer}>
                        <MaterialCommunityIcons
                            name="clock-time-eight-outline"
                            size={14}
                            color="#ffffff"
                        />
                        <Text style={styles.feeType}>Hours</Text>
                    </View>
                    <Text style={styles.feeAmount}>{timings.hours}</Text>
                </View>

                {/* Days */}
                <View style={styles.feeRow}>
                    <View style={styles.feeTypeContainer}>
                        <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#ffffff"
                        />
                        <Text style={styles.feeType}>Days</Text>
                    </View>
                    <Text style={styles.feeAmount}>{timings.days}</Text>
                </View>

                {/* Note */}
                <View style={styles.noteContainer}>
                    <Ionicons
                        name="information-circle-outline"
                        size={12}
                        color="#646f7e"
                    />
                    <Text style={styles.noteText}>
                        Hours may change during holidays and special events
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    entryFeeSection: {
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
    feeCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
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
        color: colors.white,
        fontFamily: "SfProMedium",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 8,
    },
    feeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    feeTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    feeType: {
        color: colors.white,
        fontFamily: "SfProMedium",
        fontSize: 14,
        marginLeft: 10,
    },
    feeAmount: {
        color: colors.white,
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
    },
    noFeeText: {
        color: colors.white,
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontStyle: "italic",
        textAlign: "center",
        width: "100%",
    },
    freeTag: {
        color: colors.secondary,
    },
    noteContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: 6,
        borderRadius: 6,
    },
    noteText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginLeft: 5,
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(EntryFeeSection);
