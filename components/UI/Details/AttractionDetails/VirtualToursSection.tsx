/**
 * VirtualToursSection Component
 * Author: SomnathChW
 * Created: 2025-07-09
 *
 * This component renders a horizontal scrollable list of virtual tours
 * with image, name, and VR icon.
 */

import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import Animated, { FadeIn } from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

// Get screen dimensions
const { width } = Dimensions.get("screen");

// Define the structure of a virtual tour item
interface VirtualTour {
    identifier: string;
    name: string;
    image: string;
    tour_resource: string; // URL or identifier for the tour resourceS
}

interface VirtualToursSectionProps {
    tours: VirtualTour[];
    onTourPress?: (tour: VirtualTour) => void;
    numCardsToShow?: number; // Number of cards to show on screen
}

// Constants for card dimensions calculation
const DEFAULT_NUM_CARDS = 2.5; // Default number of cards to show
const WIDTH_RATIO = 0.36; // Width ratio relative to screen width

/**
 * Individual virtual tour card component
 */
const VirtualTourCard = React.memo(
    ({
        tour,
        onPress,
        cardWidth,
    }: {
        tour: VirtualTour;
        onPress?: () => void;
        cardWidth: number;
    }) => {
        return (
            <TouchableWithoutFeedback
                style={[{ width: cardWidth }, styles.tourCard]}
                onPress={onPress}
            >
                {/* Card Image */}
                <View style={styles.tourCardImageContainer}>
                    <FastImage
                        source={{
                            uri: tour.image,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={styles.tourCardImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {/* VR Icon Overlay */}
                    <View style={styles.vrIconContainer}>
                        <FontAwesome5
                            name="vr-cardboard"
                            size={12}
                            color="#fff"
                        />
                    </View>
                </View>

                {/* Card Content */}
                <View style={styles.tourCardContent}>
                    <Text style={styles.tourCardTitle} numberOfLines={1}>
                        {tour.name}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
);

/**
 * End of data card component
 */
const EndDataCard = React.memo(({ cardWidth }: { cardWidth: number }) => {
    return (
        <View style={[styles.endCard, { width: cardWidth }]}>
            {/* Dummy image and text for height matching, hidden from view */}
            <View style={styles.tourCardImageContainer}>
                <FastImage
                    source={{
                        uri: "https://dummyimage.com/300x100/1a2432/fff.png&text=Dummy",
                        priority: FastImage.priority.low,
                    }}
                    style={[styles.tourCardImage, { opacity: 0 }]}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={[styles.vrIconContainer, { opacity: 0 }]}>
                    <FontAwesome5 name="vr-cardboard" size={12} color="#fff" />
                </View>
            </View>
            <View style={styles.tourCardContent}>
                <Text style={[styles.tourCardTitle, { opacity: 0 }]}>
                    Dummy Tour
                </Text>
            </View>
            {/* Actual end card content, absolutely centered */}
            <View style={styles.endCardAbsoluteContent}>
                <Ionicons
                    name="checkmark-circle-outline"
                    size={32}
                    color="#646f7e"
                />
                <Text style={styles.endCardText}>That's all we have now</Text>
            </View>
        </View>
    );
});

/**
 * Empty state component when no virtual tours are available
 */
const EmptyToursState = () => {
    return (
        <View style={styles.emptyStateContainer}>
            <FontAwesome5 name="vr-cardboard" size={24} color="#646f7e" />
            <Text style={styles.emptyStateText}>
                We're working on bringing virtual tours to this attraction soon.
            </Text>
            <Text style={styles.emptyStateSubText}>
                Check back later for immersive experiences!
            </Text>
        </View>
    );
};

/**
 * VirtualToursSection renders a horizontal scrollable list of virtual tours
 */
const VirtualToursSection: React.FC<VirtualToursSectionProps> = ({
    tours,
    onTourPress,
    numCardsToShow = DEFAULT_NUM_CARDS,
}) => {
    // Calculate card width and spacing based on number of cards to show
    const cardWidth = Math.ceil(width * WIDTH_RATIO);
    const cardSpacing = Math.ceil(
        (width * (1 - WIDTH_RATIO * numCardsToShow)) / (numCardsToShow * 2)
    );

    // Handler for tour card press
    const handleTourPress = (tour: VirtualTour) => {
        if (onTourPress) {
            onTourPress(tour);
        }
    };

    return (
        <Animated.View
            style={styles.toursSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Virtual Tours</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {tours.length === 0 ? (
                <EmptyToursState />
            ) : (
                <>
                    {/* Horizontal ScrollView for Cards */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.toursCardsContainer}
                        removeClippedSubviews={true}
                        decelerationRate="fast"
                    >
                        {tours.map((tour) => (
                            <VirtualTourCard
                                key={tour.identifier}
                                tour={tour}
                                onPress={() => handleTourPress(tour)}
                                cardWidth={cardWidth}
                            />
                        ))}
                        {/* End of data card */}
                        {tours.length > 0 && (
                            <EndDataCard cardWidth={cardWidth} />
                        )}
                    </ScrollView>

                    {/* Disclaimer Note */}
                    <View style={styles.disclaimerContainer}>
                        <Ionicons
                            name="information-circle-outline"
                            size={12}
                            color="#646f7e"
                        />
                        <Text style={styles.disclaimerText}>
                            Virtual tours require high-speed internet connection
                        </Text>
                    </View>
                </>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toursSection: {
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
    toursCardsContainer: {
        paddingVertical: 10,
    },
    tourCard: {
        width: 150,
        marginRight: 12,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#1a2029",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    tourCardImageContainer: {
        width: "100%",
        height: 100,
        position: "relative",
    },
    tourCardImage: {
        width: "100%",
        height: "100%",
    },
    vrIconContainer: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    tourCardContent: {
        flexDirection: "column",
        paddingVertical: 16,
        paddingHorizontal: 12,
        flex: 1,
        justifyContent: "center",
        display: "flex",
    },
    tourCardTitle: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 13,
        fontWeight: "bold",
    },
    disclaimerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: 6,
        borderRadius: 6,
        marginHorizontal: 2,
    },
    disclaimerText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginLeft: 5,
    },
    // Empty state styles
    emptyStateContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a2029",
        borderRadius: 10,
        padding: 20,
        marginVertical: 15,
        marginHorizontal: 2,
    },
    emptyStateText: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 14,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 6,
        lineHeight: 21,
    },
    emptyStateSubText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        textAlign: "center",
    },
    // End card styles
    endCard: {
        marginRight: 12,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#1a2029",
        borderWidth: 1,
        borderColor: "#2c3440",
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // for absolute centering
    },
    endCardAbsoluteContent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    endCardText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginTop: 12,
        textAlign: "center",
        wordWrap: "break-word",
        maxWidth: "80%",
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(VirtualToursSection);
