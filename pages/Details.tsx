import React, { useEffect, useCallback, useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolation,
    withTiming,
    cancelAnimation,
    useDerivedValue,
    runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FastImage from "react-native-fast-image";

const { height } = Dimensions.get("screen");
const HEADER_MAX_HEIGHT = height * 0.45;
const HEADER_MIN_HEIGHT = 55;

const FEATURES = [
    { icon: "wifi", text: "Free WiFi" },
    { icon: "restaurant", text: "Restaurant" },
    { icon: "car", text: "Free Parking" },
    { icon: "snow", text: "Air Conditioning" },
];

// Define props interface for LazyImage component
interface LazyImageProps {
    source: any;
    style: any;
    contentFit?: string;
    priority?: "low" | "normal" | "high";
}

// Optimized LazyImage component with proper loading states
const LazyImage = React.memo(
    ({
        source,
        style,
        contentFit = "cover",
        priority = "normal",
    }: LazyImageProps) => {
        const isLoaded = useSharedValue(0);

        // Optimized animated style with worklet
        const animatedStyles = useAnimatedStyle(() => {
            "worklet";
            return { opacity: isLoaded.value };
        }, []);

        // Preload only high priority images
        useEffect(() => {
            if (priority === "high") {
                FastImage.preload([{ uri: source.uri }]);
            }
        }, [source.uri, priority]);

        const onLoad = useCallback(() => {
            isLoaded.value = withTiming(1, { duration: 300 });
        }, [isLoaded]);

        return (
            <View style={[style, { backgroundColor: "#1a2432" }]}>
                <Animated.View
                    style={[StyleSheet.absoluteFill, animatedStyles]}
                >
                    <FastImage
                        source={{
                            ...source,
                            priority: FastImage.priority[priority],
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={StyleSheet.absoluteFill}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoad={onLoad}
                    />
                </Animated.View>
            </View>
        );
    }
);

// Memoized feature item component
const FeatureItem = React.memo(
    ({ icon, text }: { icon: any; text: string }) => (
        <View style={styles.featureItem}>
            <Ionicons name={icon} size={20} color="#646f7e" />
            <Text style={styles.featureText}>{text}</Text>
        </View>
    )
);

// Optimized component loader - only renders when needed
const DelayedComponentLoader = ({
    shouldRender = false,
    delay = 0,
    children,
}: {
    shouldRender?: boolean;
    delay?: number;
    children: React.ReactNode;
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (shouldRender) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, delay);
            return () => clearTimeout(timer);
        }
        return () => {};
    }, [shouldRender, delay]);

    if (!isVisible) return null;
    return children;
};

// Optimized similar card component with reduced re-renders
const SimilarCard = React.memo(({ item }: { item: any }) => (
    <View style={styles.similarCard}>
        <LazyImage
            source={{
                uri: "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
            }}
            style={styles.similarCardImage}
            priority="low"
        />
        <View style={styles.similarCardContent}>
            <Text style={styles.similarCardTitle}>Related Place {item}</Text>
            <View style={styles.similarRatingContainer}>
                {[0, 1, 2].map((_, index) => (
                    <Ionicons
                        key={index}
                        name="star"
                        size={12}
                        color="#FFD700"
                    />
                ))}
                <Text style={styles.similarCardRating}>4.7</Text>
            </View>
        </View>
    </View>
));

const Details = () => {
    const params = useLocalSearchParams();
    const identifier = params?.identifier || "Sample Place";
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // State for phased loading
    const [animationPhase, setAnimationPhase] = useState(0); // 0: initial, 1: basic, 2: full
    const [showSimilar, setShowSimilar] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);

    // Reference tracking
    const isInitialRender = useRef(true);

    const minimizedHeaderHeight = HEADER_MIN_HEIGHT + insets.top;
    const scrollDistance = HEADER_MAX_HEIGHT - minimizedHeaderHeight;

    // Animation values
    const scrollY = useSharedValue(0);
    const isReady = useSharedValue(0);

    // Optimized scroll handler with worklet
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            scrollY.value = event.contentOffset.y;
        },
    });

    // Navigation back handler
    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    // Progressive animation loading
    useEffect(() => {
        // Skip heavy animations on first render
        if (isInitialRender.current) {
            isInitialRender.current = false;

            // Phase 1: Just show the basic UI (minimal animations)
            requestAnimationFrame(() => {
                isReady.value = withTiming(0.6, { duration: 0 });
                setAnimationPhase(1);

                // Phase 2: Enable full animations after navigation completes
                setTimeout(() => {
                    InteractionManager.runAfterInteractions(() => {
                        setAnimationPhase(2);
                        isReady.value = withTiming(1, { duration: 200 });

                        // Phase 3: Load non-critical UI elements last
                        setTimeout(() => {
                            setShowFeatures(true);
                            setTimeout(() => setShowSimilar(true), 100);
                        }, 100);
                    });
                }, 300);
            });
        }

        return () => {
            cancelAnimation(scrollY);
            cancelAnimation(isReady);
        };
    }, [isReady, scrollY]);

    // Optimized derived animations with worklet
    const animations = useDerivedValue(() => {
        "worklet";

        // During initial load, use simplified animation values
        if (animationPhase < 2) {
            return {
                headerHeight: HEADER_MAX_HEIGHT,
                imageOpacity: 1,
                imageScale: 1,
                minimizedHeaderOpacity: 0,
                backButtonOpacity: 1,
            };
        }

        // Full animations for phase 2+
        return {
            headerHeight: interpolate(
                scrollY.value,
                [0, scrollDistance],
                [HEADER_MAX_HEIGHT, minimizedHeaderHeight],
                Extrapolation.CLAMP
            ),
            imageOpacity: interpolate(
                scrollY.value,
                [0, scrollDistance],
                [1, 0],
                Extrapolation.CLAMP
            ),
            imageScale: interpolate(
                scrollY.value,
                [0, scrollDistance],
                [1, 1.2],
                Extrapolation.CLAMP
            ),
            minimizedHeaderOpacity: interpolate(
                scrollY.value,
                [scrollDistance * 0.7, scrollDistance],
                [0, 1],
                Extrapolation.CLAMP
            ),
            backButtonOpacity: interpolate(
                scrollY.value,
                [0, scrollDistance * 0.5],
                [1, 0],
                Extrapolation.CLAMP
            ),
        };
    }, [animationPhase, scrollDistance, minimizedHeaderHeight]);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            height: animations.value.headerHeight,
            opacity: isReady.value,
        };
    }, []);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            opacity: animations.value.imageOpacity,
            transform: [{ scale: animations.value.imageScale }],
        };
    }, []);

    const minimizedHeaderStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            opacity: animations.value.minimizedHeaderOpacity,
        };
    }, []);

    const floatingBackButtonStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            opacity: animations.value.backButtonOpacity,
        };
    }, []);

    // Memoized content components
    const renderTitle = React.useMemo(
        () => (
            <View style={styles.titleSection}>
                <Text style={styles.title}>{identifier}</Text>
                <View style={styles.ratingContainer}>
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <Ionicons
                                key={index}
                                name="star"
                                size={16}
                                color="#FFD700"
                            />
                        ))}
                    <Text style={styles.ratingText}>4.8 (240 reviews)</Text>
                </View>
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color="#646f7e" />
                    <Text style={styles.locationText}>Assam, India</Text>
                </View>
            </View>
        ),
        [identifier]
    );

    const renderAbout = React.useMemo(
        () => (
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.separator} />
                <Text style={styles.details}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla facilisis, nunc vel tincidunt vestibulum, risus leo
                    varius nisl, a dignissim velit massa eu mauris.
                </Text>
            </View>
        ),
        []
    );

    const renderFeatures = React.useMemo(
        () => (
            <DelayedComponentLoader shouldRender={showFeatures}>
                <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.separator} />
                    <View style={styles.featuresList}>
                        {FEATURES.map((feature, index) => (
                            <FeatureItem
                                key={index}
                                icon={feature.icon}
                                text={feature.text}
                            />
                        ))}
                    </View>
                </View>
            </DelayedComponentLoader>
        ),
        [showFeatures]
    );

    const renderSimilarPlaces = React.useMemo(
        () => (
            <DelayedComponentLoader shouldRender={showSimilar}>
                <View style={styles.similarSection}>
                    <Text style={styles.sectionTitle}>Similar Places</Text>
                    <View style={styles.separator} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.similarCardsContainer}
                    >
                        {showSimilar &&
                            [1, 2, 3].map((item) => (
                                <SimilarCard key={item} item={item} />
                            ))}
                    </ScrollView>
                </View>
            </DelayedComponentLoader>
        ),
        [showSimilar]
    );

    // Static styles calculated once
    const staticStyles = React.useMemo(
        () => ({
            minimizedHeaderContainer: {
                height: minimizedHeaderHeight,
                paddingTop: insets.top,
                backgroundColor: "#1a2432",
            },
            floatingBackButtonContainer: {
                top: insets.top + 10,
            },
            scrollContentContainer: {
                paddingTop: HEADER_MAX_HEIGHT,
            },
        }),
        [insets.top, minimizedHeaderHeight]
    );

    // Select appropriate animation style based on phase
    const currentHeaderStyle =
        animationPhase >= 2
            ? headerAnimatedStyle
            : {
                  height: HEADER_MAX_HEIGHT,
                  opacity: isReady.value,
              };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header, currentHeaderStyle]}>
                {/* Use preloaded image for header to prevent flashing */}
                <Animated.View
                    style={animationPhase >= 2 ? imageAnimatedStyle : {}}
                >
                    <FastImage
                        source={{
                            uri: "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={styles.headerImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </Animated.View>

                {animationPhase >= 2 && (
                    <Animated.View
                        style={[
                            styles.minimizedHeader,
                            staticStyles.minimizedHeaderContainer,
                            minimizedHeaderStyle,
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.headerBackButton}
                            onPress={handleBack}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <Text style={styles.minimizedTitle} numberOfLines={1}>
                            {identifier}
                        </Text>
                        <View style={styles.headerRightPlaceholder} />
                    </Animated.View>
                )}

                <Animated.View
                    style={[
                        styles.floatingBackButton,
                        staticStyles.floatingBackButtonContainer,
                        animationPhase >= 2 ? floatingBackButtonStyle : {},
                    ]}
                >
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.8}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={[
                    styles.scrollViewContent,
                    staticStyles.scrollContentContainer,
                ]}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                overScrollMode="never"
                keyboardShouldPersistTaps="handled"
            >
                {renderTitle}
                {renderAbout}
                {renderFeatures}
                {renderSimilarPlaces}
            </Animated.ScrollView>
        </View>
    );
};

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
        overflow: "hidden",
        zIndex: 10,
        backgroundColor: "#0d1116",
    },
    headerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    minimizedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
        justifyContent: "flex-start",
        paddingHorizontal: 15,
        zIndex: 20,
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    headerRightPlaceholder: {
        width: 40,
    },
    minimizedTitle: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    floatingBackButton: {
        position: "absolute",
        left: 20,
        zIndex: 15,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollViewContent: {
        paddingHorizontal: 20,
    },
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
    detailsSection: {
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
    details: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 16,
        lineHeight: 25,
        marginBottom: 15,
    },
    featuresSection: {
        marginBottom: 30,
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
    similarSection: {
        marginBottom: 30,
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
    similarCardImage: {
        width: "100%",
        height: 120,
        resizeMode: "cover",
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

export default Details;
