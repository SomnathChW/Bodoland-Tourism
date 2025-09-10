import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    cancelAnimation,
    runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderSection from "@/components/UI/Details/Common/HeaderSection";
import HeaderLoader from "@/components/UI/Details/Common/HeaderLoader";

// Import data
import AttractionDetails from "@/components/UI/Details/AttractionDetails/AttractionDetails";
import SouvenirDetails from "@/components/UI/Details/SouvenirDetails/SouvenirDetails";
import StayDetails from "@/components/UI/Details/StayDetails/StayDetails";
import FestivalDetails from "@/components/UI/Details/FestivalDetails/FestivalDetails";
import CuisineDetails from "@/components/UI/Details/CuisineDetails/CuisineDetails";
import TransportDetails from "@/components/UI/Details/TransportDetails/TransportDetails";
import StickyPurchaseButtons from "@/components/UI/Details/SouvenirDetails/StickyPurchaseButtons";
import DetailsError from "@/components/UI/Details/Common/DetailsError";

const { height } = Dimensions.get("screen");
const HEADER_MAX_HEIGHT = height * 0.45;
const HEADER_MIN_HEIGHT = 55;

const Details = () => {
    const params = useLocalSearchParams();
    const identifier = params?.identifier || "Sample Place";
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // State to hold fetched data
    const [fetchedData, setFetchedData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const minimizedHeaderHeight = HEADER_MIN_HEIGHT + insets.top;
    const scrollDistance = HEADER_MAX_HEIGHT - minimizedHeaderHeight;

    // Animation values
    const scrollY = useSharedValue(0);
    const isReady = useSharedValue(1); // Always set to 1 since we don't need phased loading

    // Scroll handler with optimized performance
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            // Only update if there's a meaningful change (reduce unnecessary updates)
            const newScrollY = event.contentOffset.y;
            if (Math.abs(newScrollY - scrollY.value) > 0.5) {
                scrollY.value = newScrollY;
            }
        },
        onBeginDrag: () => {
            "worklet";
            // Optional: Handle scroll start
        },
        onEndDrag: () => {
            "worklet";
            // Optional: Handle scroll end
        },
    });

    // Cleanup animations on unmount
    useEffect(() => {
        return () => {
            cancelAnimation(scrollY);
            cancelAnimation(isReady);
        };
    }, []);

    // Memoized handler for when data is fetched
    const handleDataFetched = React.useCallback((data: any) => {
        setFetchedData(data);
        setIsLoading(false);
    }, []);

    // Memoized handler for error cases
    const handleFetchError = React.useCallback(() => {
        setIsLoading(false);
        setIsError(true);
    }, []);

    // Static styles calculated once
    const staticStyles = React.useMemo(
        () => ({
            scrollContentContainer: {
                paddingTop: HEADER_MAX_HEIGHT,
            },
            container: {
                flex: 1,
                backgroundColor: "#0d1116",
            },
            scrollViewContent: {
                paddingHorizontal: 20,
            },
        }),
        []
    );

    // Memoized function to return structure based on identifier
    const getDetailsStructure = React.useMemo(() => {
        const detail_type = (identifier as string)
            .split(/[-_]/)[0]
            .toLowerCase();
        switch (detail_type) {
            case "attraction":
                return (
                    <AttractionDetails
                        identifier={identifier as string}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
            case "souvenir":
                return (
                    <SouvenirDetails
                        identifier={identifier as string}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
            case "stay":
                return (
                    <StayDetails
                        identifier={identifier as string}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
            case "festival":
                return (
                    <FestivalDetails
                        identifier={identifier as string}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
            case "cuisine":
                return (
                    <CuisineDetails
                        identifier={identifier as string}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
            case "transport":
                return (
                    <TransportDetails
                        identifier={identifier as string}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
            default:
                return (
                    <AttractionDetails
                        identifier={identifier as string}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
        }
    }, [identifier, handleDataFetched, handleFetchError]);

    // Check if current page is for souvenirs
    const isSouvenirDetail =
        (identifier as string).split(/[-_]/)[0].toLowerCase() === "souvenir";

    // Show error state and parent notified by onError callback through hook
    if (isError) {
        return <DetailsError />;
    }

    return (
        <View style={staticStyles.container}>
            {/* Loading header */}
            {isLoading && !isError && <HeaderLoader />}

            {/* Dynamic header that shows when data is loaded */}
            {!isLoading && !isError && (
                <HeaderSection
                    scrollY={scrollY}
                    isReady={isReady}
                    animationPhase={1}
                    minimizedHeaderHeight={minimizedHeaderHeight}
                    scrollDistance={scrollDistance}
                    onBack={() => router.back()}
                    insets={insets}
                    data={fetchedData}
                />
            )}

            <Animated.ScrollView
                contentContainerStyle={[
                    staticStyles.scrollViewContent,
                    staticStyles.scrollContentContainer,
                    isSouvenirDetail && { paddingBottom: 80 }, // Add padding for sticky buttons
                ]}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={4} // Increased for smoother animations
                removeClippedSubviews={true}
                overScrollMode="auto"
                keyboardShouldPersistTaps="handled"
                scrollEnabled={!isLoading && !isError}
                // Performance optimizations
                disableIntervalMomentum={true}
                bounces={false}
                directionalLockEnabled={true}
            >
                {/* Render sections based on structure */}
                {getDetailsStructure}
            </Animated.ScrollView>

            {/* Sticky Purchase Buttons - Only for souvenirs */}
            {isSouvenirDetail && fetchedData && (
                <StickyPurchaseButtons inStock={fetchedData.in_stock} />
            )}
        </View>
    );
};

export default React.memo(Details);
