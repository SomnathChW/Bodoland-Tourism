/**
 * CulturalSignificanceSection Component
 * Author: SomnathChW
 * Created: 2025-08-04
 *
 * This component renders cultural significance and recipe information for cuisine items.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

interface CulturalSignificanceSectionProps {
    culturalSignificance?: string;
    isVegan?: boolean;
    isVegetarian?: boolean;
}

const CulturalSignificanceSection: React.FC<
    CulturalSignificanceSectionProps
> = ({ culturalSignificance, isVegan = false, isVegetarian = false }) => {
    // Always show dietary info, cultural significance is optional
    // No need to return null as dietary chips should always be displayed

    return (
        <Animated.View
            style={styles.culturalSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Cultural & Dietary Info</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Dietary Chips */}
            <View style={styles.chipsContainer}>
                {/* Vegetarian Status - always show either vegetarian or non-vegetarian */}
                {isVegetarian ? (
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="leaf"
                            size={16}
                            color="#2ecc71"
                        />
                        <Text style={styles.chipText}>Vegetarian</Text>
                    </View>
                ) : (
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="food-drumstick"
                            size={16}
                            color="#f39c12"
                        />
                        <Text style={[styles.chipText, { color: "#f39c12" }]}>
                            Non-Vegetarian
                        </Text>
                    </View>
                )}

                {/* Vegan Status - always show either vegan or not vegan */}
                {isVegan ? (
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="sprout"
                            size={16}
                            color="#2ecc71"
                        />
                        <Text style={styles.chipText}>Vegan</Text>
                    </View>
                ) : (
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="nutrition"
                            size={16}
                            color="#646f7e"
                        />
                        <Text style={[styles.chipText, { color: "#646f7e" }]}>
                            Not Vegan
                        </Text>
                    </View>
                )}
            </View>

            {/* Cultural Significance Card */}
            {culturalSignificance && (
                <View style={[styles.culturalCard, { marginTop: 16 }]}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons
                            name="star-outline"
                            size={18}
                            color="#ffffff"
                        />
                        <Text style={styles.cardHeaderText}>
                            Cultural Significance
                        </Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.culturalText}>
                            {culturalSignificance}
                        </Text>
                    </View>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    culturalSection: {
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
    culturalCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
        overflow: "hidden",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cardHeaderText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 8,
        fontFamily: "SfProMedium",
    },
    cardContent: {
        padding: 16,
    },
    culturalText: {
        fontSize: 14,
        color: "#ffffff",
        lineHeight: 22,
        fontFamily: "SfProMedium",
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 8,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "rgba(100,111,126,0.3)",
    },
    chipText: {
        fontSize: 12,
        color: "#2ecc71",
        fontFamily: "SfProMedium",
        fontWeight: "600",
        marginLeft: 4,
    },
});

export default CulturalSignificanceSection;
