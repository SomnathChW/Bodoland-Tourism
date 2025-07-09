/**
 * LocationMapSection Component
 * Author: GitHub Copilot
 * Created: 2025-07-09
 *
 * This component provides a button to open coordinates in map application.
 */

import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
    Platform,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface LocationMapProps {
    latitude: number;
    longitude: number;
    locationName?: string;
}

const LocationMapSection: React.FC<LocationMapProps> = ({
    latitude,
    longitude,
    locationName = "Location",
}) => {
    // Function to open location in maps app
    const openInMaps = () => {
        const label = encodeURIComponent(locationName);

        // Different URL schemes for iOS and Android
        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}(${label})`,
        });

        if (url) {
            Linking.openURL(url).catch((err) =>
                console.error("An error occurred opening maps:", err)
            );
        }
    };

    return (
        <Animated.View
            style={styles.locationSection}
            entering={FadeIn.duration(600)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Location</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Location Content */}
            <View style={styles.contentContainer}>
                {/* Coordinates Display */}
                <View style={styles.coordinatesContainer}>
                    <Ionicons
                        name="location"
                        size={20}
                        color="#ffffff"
                        style={styles.locationIcon}
                    />
                    <View>
                        <Text
                            style={styles.locationNameText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {locationName}
                        </Text>
                        <Text style={styles.coordinatesText}>
                            {latitude.toFixed(4)}, {longitude.toFixed(4)}
                        </Text>
                    </View>
                </View>

                {/* Open In Maps Button */}
                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={openInMaps}
                    activeOpacity={0.7}
                >
                    <Ionicons name="map-outline" size={18} color="#0d1116" />
                    <Text style={styles.mapButtonText}>Open in Maps</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    locationSection: {
        marginBottom: 30,
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
    contentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    coordinatesContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationIcon: {
        marginRight: 8,
    },
    locationNameText: {
        color: "white",
        fontFamily: "SfProMedium",
        fontSize: 13,
        marginBottom: 2,
    },
    coordinatesText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
    },
    mapButton: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    mapButtonText: {
        color: "#0d1116",
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 8,
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(LocationMapSection);
