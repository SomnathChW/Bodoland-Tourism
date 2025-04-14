/**
 * TitleSection Component
 * Author: SomnathCh
 * Created: 2025-04-14 08:21:22 UTC
 *
 * This component renders the title, rating, and location information
 * for the Details page.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TitleSectionProps {
    identifier: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ identifier }) => {
    // Render rating stars
    const renderRatingStars = () => {
        return Array(5)
            .fill(0)
            .map((_, index) => (
                <Ionicons key={index} name="star" size={16} color="#FFD700" />
            ));
    };

    return (
        <View style={styles.titleSection}>
            {/* Main Title */}
            <Text style={styles.title}>{identifier}</Text>

            {/* Rating Container */}
            <View style={styles.ratingContainer}>
                {renderRatingStars()}
                <Text style={styles.ratingText}>4.8 (240 reviews)</Text>
            </View>

            {/* Location Container */}
            <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#646f7e" />
                <Text style={styles.locationText}>Assam, India</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    titleSection: {
        marginTop: 20,
        marginBottom: 25,
    },
    title: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    ratingText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 14,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: {
        color: "#646f7e",
        marginLeft: 5,
        fontSize: 14,
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(TitleSection);
