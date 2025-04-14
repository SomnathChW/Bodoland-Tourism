/**
 * FeaturesSection Component
 * Author: SomnathChW
 * Created: 2025-04-14 08:25:46 UTC
 *
 * This component renders a grid of features/amenities
 * with icons and labels for the Details page.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

// Define the structure of a feature item
interface Feature {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
}

interface FeaturesSectionProps {
    // Optional features array - if not provided, uses default features
    features?: Feature[];
}

// Default features to display if none are provided
const DEFAULT_FEATURES: Feature[] = [
    { icon: "wifi", text: "Free WiFi" },
    { icon: "restaurant", text: "Restaurant" },
    { icon: "car", text: "Free Parking" },
    { icon: "snow", text: "Air Conditioning" },
];

/**
 * Individual feature item component
 */
const FeatureItem = React.memo(
    ({ icon, text, index }: Feature & { index: number }) => {
        // Create animated component for the feature with staggered entrance
        return (
            <Animated.View style={styles.featureItem}>
                <Ionicons name={icon} size={20} color="#646f7e" />
                <Text style={styles.featureText}>{text}</Text>
            </Animated.View>
        );
    }
);

/**
 * FeaturesSection renders a grid of features/amenities
 */
const FeaturesSection: React.FC<FeaturesSectionProps> = ({
    features = DEFAULT_FEATURES,
}) => {
    return (
        <Animated.View
            style={styles.featuresSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Features</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Features Grid */}
            <View style={styles.featuresList}>
                {features.map((feature, index) => (
                    <FeatureItem
                        key={index}
                        icon={feature.icon}
                        text={feature.text}
                        index={index}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    featuresSection: {
        marginBottom: 30,
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
    featuresList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "48%",
        marginBottom: 15,
        backgroundColor: "rgba(100, 111, 126, 0.1)",
        padding: 12,
        borderRadius: 10,
    },
    featureText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 14,
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(FeaturesSection);
