/**
 * SimilarPlacesSection Component
 * Author: SomnathChW
 * Created: 2025-04-14 08:27:38 UTC
 *
 * This component renders a horizontal scrollable list of similar places/recommendations
 * for the Details page.
 */

import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";

// Define the structure of a place item
interface Place {
    id: number | string;
    title: string;
    imageUri: string;
    rating: number;
}

interface SimilarPlacesSectionProps {
    // Optional places array - if not provided, uses default places
    places?: Place[];
}

// Default places to display if none are provided
const DEFAULT_PLACES: Place[] = [
    {
        id: 1,
        title: "Related Place 1",
        imageUri:
            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
        rating: 4.7,
    },
    {
        id: 2,
        title: "Related Place 2",
        imageUri:
            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
        rating: 4.8,
    },
    {
        id: 3,
        title: "Related Place 3",
        imageUri:
            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
        rating: 4.5,
    },
];

/**
 * Individual similar place card component
 */
const SimilarCard = React.memo(
    ({ place, index }: { place: Place; index: number }) => {
        // Create animated component for the card with staggered entrance
        return (
            <Animated.View style={styles.similarCard}>
                {/* Card Image */}
                <View style={styles.similarCardImageContainer}>
                    <FastImage
                        source={{
                            uri: place.imageUri,
                            priority: FastImage.priority.low,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={styles.similarCardImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>

                {/* Card Content */}
                <View style={styles.similarCardContent}>
                    <Text style={styles.similarCardTitle} numberOfLines={1}>
                        {place.title}
                    </Text>
                    <View style={styles.similarRatingContainer}>
                        {/* Display 3 stars */}
                        {[0, 1, 2].map((_, starIndex) => (
                            <Ionicons
                                key={starIndex}
                                name="star"
                                size={12}
                                color="#FFD700"
                            />
                        ))}
                        <Text style={styles.similarCardRating}>
                            {place.rating}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        );
    }
);

/**
 * SimilarPlacesSection renders a horizontal scrollable list of similar places
 */
const SimilarPlacesSection: React.FC<SimilarPlacesSectionProps> = ({
    places = DEFAULT_PLACES,
}) => {
    return (
        <Animated.View
            style={styles.similarSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Similar Places</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Horizontal ScrollView for Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarCardsContainer}
                removeClippedSubviews={true}
                decelerationRate="fast"
            >
                {places.map((place, index) => (
                    <SimilarCard key={place.id} place={place} index={index} />
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    similarSection: {
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
    similarCardsContainer: {
        paddingVertical: 10,
    },
    similarCard: {
        width: 180,
        marginRight: 15,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "rgba(100, 111, 126, 0.1)",
    },
    similarCardImageContainer: {
        width: "100%",
        height: 120,
        backgroundColor: "#1a2432", // Placeholder color while image loads
    },
    similarCardImage: {
        width: "100%",
        height: "100%",
    },
    similarCardContent: {
        padding: 10,
    },
    similarCardTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    similarRatingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    similarCardRating: {
        color: "#fff",
        fontSize: 12,
        marginLeft: 5,
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(SimilarPlacesSection);
