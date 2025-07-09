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
    showRating?: boolean;
    location?: boolean;
}

const TitleSection = ({
    identifier,
    showRating,
    location,
}: TitleSectionProps) => {
    // Render rating stars
    const renderRatingStars = ({ rating }: { rating: number }) => {
        // Sanitize to increments of 0.5
        const sanitizedRating = Math.round(rating * 2) / 2;
        // Calculate the number of full stars
        const fullStars = Math.floor(sanitizedRating);
        // Calculate if there's a half star
        const hasHalfStar = sanitizedRating % 1 !== 0;

        // Create an array of stars
        const stars = Array.from({ length: 5 }, (_, index) => {
            if (index < fullStars) {
                return (
                    <Ionicons
                        key={index}
                        name="star"
                        size={16}
                        color="#FFD700"
                    />
                );
            } else if (hasHalfStar && index === fullStars) {
                return (
                    <Ionicons
                        key={index}
                        name="star-half"
                        size={16}
                        color="#FFD700"
                    />
                );
            } else {
                return (
                    <Ionicons
                        key={index}
                        name="star-outline"
                        size={16}
                        color="#FFD700"
                    />
                );
            }
        });
        return stars;
    };

    return (
        <View style={styles.titleSection}>
            {/* Main Title */}
            <Text style={styles.title}>{identifier}</Text>

            {/* Rating Container */}
            {showRating && (
                <View style={styles.ratingContainer}>
                    {renderRatingStars({ rating: 4.8 })}
                    <Text style={styles.ratingText}>4.8 (240 reviews)</Text>
                </View>
            )}
            {/* Location Container */}
            {location && (
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color="#646f7e" />
                    <Text style={styles.locationText}>Assam, India</Text>
                </View>
            )}
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
