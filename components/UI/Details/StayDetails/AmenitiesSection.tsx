/**
 * AmenitiesSection Component for Stays
 * Author: SomnathChW
 * Created: 2025-10-04
 *
 * This component renders the amenities available at the stay.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface AmenitiesSectionProps {
    amenities: string[];
}

// Map of common amenity names to icons
const amenityIcons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    wifi: "wifi",
    "wi-fi": "wifi",
    parking: "car",
    "free parking": "car",
    pool: "water",
    "swimming pool": "water",
    gym: "fitness",
    fitness: "fitness",
    restaurant: "restaurant",
    "room service": "fast-food",
    spa: "flower",
    "air conditioning": "snow",
    ac: "snow",
    tv: "tv",
    television: "tv",
    breakfast: "fast-food",
    "free breakfast": "fast-food",
    bar: "beer",
    laundry: "shirt",
    "24/7 service": "time",
    "24-hour service": "time",
    "pet friendly": "paw",
    pets: "paw",
    balcony: "home",
    garden: "leaf",
    elevator: "arrow-up-circle",
    lift: "arrow-up-circle",
    safe: "lock-closed",
    "conference room": "business",
    "meeting room": "business",
    kitchen: "restaurant-outline",
    minibar: "beer-outline",
    "hot water": "water",
    geyser: "water",
};

/**
 * Get appropriate icon for an amenity
 */
const getAmenityIcon = (amenity: string): keyof typeof Ionicons.glyphMap => {
    const lowerAmenity = amenity.toLowerCase().trim();

    // Check for exact or partial matches
    for (const [key, icon] of Object.entries(amenityIcons)) {
        if (lowerAmenity.includes(key)) {
            return icon;
        }
    }

    // Default icon
    return "checkmark-circle";
};

/**
 * AmenitiesSection renders available amenities
 */
export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
    amenities,
}) => {
    // Don't render if no amenities
    if (!amenities || amenities.length === 0) {
        return null;
    }

    return (
        <Animated.View
            style={styles.amenitiesSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Amenities</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Amenities Grid */}
            <View style={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => (
                    <View key={index} style={styles.amenityItem}>
                        <View style={styles.amenityIconContainer}>
                            <Ionicons
                                name={getAmenityIcon(amenity)}
                                size={18}
                                color="#27ae60"
                            />
                        </View>
                        <Text style={styles.amenityText} numberOfLines={2}>
                            {amenity}
                        </Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    amenitiesSection: {
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
        backgroundColor: "#646f7e",
        marginBottom: 15,
    },
    amenitiesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12,
    },
    amenityItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1f26",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "48%",
        gap: 8,
    },
    amenityIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(39, 174, 96, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    amenityText: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 13,
        flex: 1,
    },
});

export default React.memo(AmenitiesSection);
