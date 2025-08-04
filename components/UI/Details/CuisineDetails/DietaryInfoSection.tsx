/**
 * DietaryInfoSection Component
 * Author: SomnathChW
 * Created: 2025-08-04
 *
 * This component renders dietary information for cuisine items
 * including vegan and vegetarian indicators.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DietaryInfoSectionProps {
    isVegan?: boolean;
    isVegetarian?: boolean;
}

const DietaryInfoSection: React.FC<DietaryInfoSectionProps> = ({
    isVegan = false,
    isVegetarian = false,
}) => {
    // Always render if we have any dietary information
    if (!isVegan && !isVegetarian) {
        // Show non-vegetarian chip if neither vegan nor vegetarian
        return (
            <View style={styles.dietarySection}>
                <View style={styles.chipsContainer}>
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
                </View>
            </View>
        );
    }

    return (
        <View style={styles.dietarySection}>
            {/* Dietary Chips */}
            <View style={styles.chipsContainer}>
                {isVegetarian && (
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="leaf"
                            size={16}
                            color="#2ecc71"
                        />
                        <Text style={styles.chipText}>Vegetarian</Text>
                    </View>
                )}

                {isVegan && (
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="sprout"
                            size={16}
                            color="#2ecc71"
                        />
                        <Text style={styles.chipText}>Vegan</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dietarySection: {
        marginBottom: 20,
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
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

export default DietaryInfoSection;
