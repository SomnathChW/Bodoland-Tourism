import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    StatusBar,
    Pressable,
    Platform,
    FlatList,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("screen");

// Simplified header constants
const HEADER_MAX_HEIGHT = height * 0.4; // Reduced from 0.45
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Status bar height
const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

// Memoized components for better performance
const AboutSection = memo(({ details }) => (
    <View>
        <Text style={styles.subText}>About</Text>
        <View style={styles.divider}></View>
        <Text style={styles.details}>{details}</Text>
    </View>
));

const AmenitiesSection = memo(() => {
    const amenities = [
        { icon: "🏊", text: "Infinity Pool" },
        { icon: "🍽️", text: "Gourmet Dining" },
        { icon: "🧖", text: "Luxury Spa" },
        { icon: "🏋️", text: "Fitness Center" },
        { icon: "🚗", text: "Valet Parking" },
        { icon: "📶", text: "High-Speed WiFi" },
    ];

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={styles.subText}>Amenities</Text>
            <View style={styles.divider}></View>
            <View style={styles.amenitiesContainer}>
                {amenities.map((item, index) => (
                    <View key={index} style={styles.amenityItem}>
                        <Text style={styles.amenityIcon}>{item.icon}</Text>
                        <Text style={styles.amenityText}>{item.text}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
});

const LocationSection = memo(() => (
    <View style={{ marginTop: 20 }}>
        <Text style={styles.subText}>Location</Text>
        <View style={styles.divider}></View>
        <Text style={styles.details}>
            Nestled at the edge of Manas National Park, our resort offers
            private access to wildlife safaris and natural trails.
        </Text>

        <View style={styles.locationDetails}>
            <View style={styles.locationItem}>
                <Ionicons name="location-outline" size={18} color="#2E71F0" />
                <Text style={styles.locationText}>
                    Manas National Park, Assam
                </Text>
            </View>
        </View>
    </View>
));

const BookingSection = memo(({ onPress }) => (
    <View style={styles.bookNowContainer}>
        <View>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.priceText}>
                $299<Text style={styles.priceUnit}> / night</Text>
            </Text>
        </View>
        <Pressable style={styles.bookNowButton} onPress={onPress}>
            <Text style={styles.bookNowText}>Book Now</Text>
        </Pressable>
    </View>
));

const GalleryItem = memo(({ source }) => (
    <View style={styles.galleryItem}>
        <Image
            source={source}
            style={styles.galleryImage}
            progressiveRenderingEnabled={true}
            resizeMethod="resize"
        />
    </View>
));

const GallerySection = memo(() => {
    // Gallery images data
    const galleryImages = [
        require("@/assets/images/app_images/manas-national-park.jpg"),
        require("@/assets/images/app_images/manas-national-park.jpg"),
        require("@/assets/images/app_images/manas-national-park.jpg"),
        require("@/assets/images/app_images/manas-national-park.jpg"),
    ];

    return (
        <View style={styles.galleryContainer}>
            <Text style={styles.galleryTitle}>Photo Gallery</Text>
            <FlatList
                data={galleryImages}
                keyExtractor={(_, index) => `gallery-${index}`}
                numColumns={2}
                renderItem={({ item }) => <GalleryItem source={item} />}
                initialNumToRender={4}
                maxToRenderPerBatch={2}
                windowSize={3}
                scrollEnabled={false}
                removeClippedSubviews={true}
                style={styles.galleryGrid}
                columnWrapperStyle={{ justifyContent: "space-between" }}
            />
        </View>
    );
});

const Details = () => {
    const router = useRouter();
    const identifier = useLocalSearchParams().identifier || "Luxury Resort";
    const [isLiked, setIsLiked] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const scrollY = useSharedValue(0);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#0d1116");
        StatusBar.setBarStyle("light-content");

        // Defer loading gallery for better initial render performance
        const timer = setTimeout(() => setShowGallery(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Optimized scroll handler with worklet annotation
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            scrollY.value = event.contentOffset.y;
        },
    });

    // Combined animation styles for better performance
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: Math.max(
                HEADER_MIN_HEIGHT,
                HEADER_MAX_HEIGHT - scrollY.value
            ),
        };
    });

    const headerImageStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [HEADER_SCROLL_DISTANCE * 0.7, HEADER_SCROLL_DISTANCE],
            [1, 0],
            Extrapolation.CLAMP
        );

        return { opacity };
    });

    const titleAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [HEADER_SCROLL_DISTANCE * 0.7, HEADER_SCROLL_DISTANCE],
            [0, 1],
            Extrapolation.CLAMP
        );

        return { opacity };
    });

    const imageContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, HEADER_SCROLL_DISTANCE * 0.5],
            [1, 0],
            Extrapolation.CLAMP
        );

        return { opacity };
    });

    // Content container style
    const contentContainerStyle = {
        paddingTop: HEADER_MAX_HEIGHT,
    };

    // Function for booking - can be used with memo
    const handleBookNow = () => {
        // Booking logic here
    };

    // About text content
    const aboutText =
        "Experience luxury at our premium resort featuring spacious suites with breathtaking views of Manas National Park. Each room is elegantly designed with modern amenities and comfortable furnishings to ensure a relaxing stay.";

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />

            <Animated.ScrollView
                contentContainerStyle={[
                    styles.scrollContainer,
                    contentContainerStyle,
                ]}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                overScrollMode="never"
            >
                <View style={styles.cardContainer}>
                    <View style={styles.cardHeaderContainer}>
                        {/* About Section */}
                        <AboutSection details={aboutText} />

                        {/* Amenities Section */}
                        <AmenitiesSection />

                        {/* Location Section */}
                        <LocationSection />

                        {/* Booking Section */}
                        <BookingSection onPress={handleBookNow} />
                    </View>
                </View>

                {/* Deferred Gallery Section */}
                {showGallery && <GallerySection />}
            </Animated.ScrollView>

            {/* Header with optimized animations */}
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <Animated.Image
                    source={require("@/assets/images/app_images/manas-national-park.jpg")}
                    style={[styles.headerImage, headerImageStyle]}
                    progressiveRenderingEnabled={true}
                    resizeMethod="resize"
                />

                {/* Gradient overlay */}
                <View style={styles.gradientOverlay} />

                {/* Header content */}
                <Animated.View
                    style={[styles.imageHeaderContent, imageContentStyle]}
                >
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </Pressable>

                    <View style={styles.imageTextContainer}>
                        <Text style={styles.imageHeaderTitle}>
                            {identifier}
                        </Text>
                        <View style={styles.imageHeaderRating}>
                            <Text style={styles.imageHeaderRatingText}>
                                5.0
                            </Text>
                            <Text style={styles.imageStar}>★★★★★</Text>
                        </View>
                    </View>

                    <Pressable
                        style={styles.likeButton}
                        onPress={() => setIsLiked(!isLiked)}
                    >
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={24}
                            color={isLiked ? "#FF3B30" : "white"}
                        />
                    </Pressable>
                </Animated.View>

                {/* Mini header that appears on scroll */}
                <Animated.View
                    style={[styles.headerTitleContainer, titleAnimatedStyle]}
                >
                    <Pressable
                        style={styles.miniHeaderBackButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </Pressable>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {identifier}
                    </Text>
                    <Pressable
                        style={styles.miniHeaderLikeButton}
                        onPress={() => setIsLiked(!isLiked)}
                    >
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={22}
                            color={isLiked ? "#FF3B30" : "white"}
                        />
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0d1116",
        overflow: "hidden",
        zIndex: 999,
    },
    headerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    gradientOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100%",
        backgroundColor: "rgba(13, 17, 22, 0.4)",
    },
    imageHeaderContent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: STATUS_BAR_HEIGHT + 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    imageTextContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 70,
    },
    imageHeaderTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        marginBottom: 8,
    },
    imageHeaderRating: {
        flexDirection: "row",
        alignItems: "center",
    },
    imageHeaderRatingText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 10,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    imageStar: {
        color: "#FFD700",
        fontSize: 16,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    likeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitleContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_MIN_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(13, 17, 22, 0.95)",
        paddingHorizontal: 15,
        paddingTop: STATUS_BAR_HEIGHT,
    },
    miniHeaderBackButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
    },
    miniHeaderLikeButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 10,
    },
    scrollContainer: {
        paddingBottom: 30,
    },
    cardContainer: {
        backgroundColor: "transparent",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
    },
    cardHeaderContainer: {
        backgroundColor: "rgba(25, 32, 44, 0.95)",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingTop: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4, // Reduced for better performance
        },
        shadowOpacity: 0.15, // Reduced for better performance
        shadowRadius: 10,
        elevation: 8, // Reduced for better performance on Android
    },
    subText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    divider: {
        height: 2,
        backgroundColor: "#646f7e",
        marginBottom: 15,
        width: "100%",
    },
    details: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 16,
        lineHeight: 24,
    },
    amenitiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
    },
    amenityItem: {
        width: "50%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    amenityIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    amenityText: {
        color: "#fff",
        fontSize: 14,
    },
    locationDetails: {
        marginTop: 15,
    },
    locationItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    locationText: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 8,
    },
    bookNowContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceLabel: {
        color: "#646f7e",
        fontSize: 14,
        marginBottom: 2,
    },
    priceText: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "bold",
    },
    priceUnit: {
        fontSize: 16,
        color: "#ccc",
    },
    bookNowButton: {
        backgroundColor: "#2E71F0",
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
        shadowColor: "#2E71F0",
        shadowOffset: {
            width: 0,
            height: 4, // Reduced from 5
        },
        shadowOpacity: 0.2, // Reduced from 0.3
        shadowRadius: 6, // Reduced from 10
        elevation: 4, // Reduced from 5
    },
    bookNowText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    galleryContainer: {
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 24,
    },
    galleryTitle: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    galleryGrid: {
        width: "100%",
    },
    galleryItem: {
        width: "48%",
        marginBottom: 15,
        borderRadius: 15,
        overflow: "hidden",
        height: 120,
    },
    galleryImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});
