import React, { useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    cancelAnimation,
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
import DistrictDetails from "@/components/UI/Details/DistrictDetails/DistrictDetails";
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
    const scrollDistance = HEADER_MAX_HEIGHT;

    // Animation values
    const scrollY = useSharedValue(0);

    // Simple scroll handler for minimized header
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            scrollY.value = event.contentOffset.y;
        },
    });

    // Cleanup animations on unmount
    useEffect(() => {
        return () => {
            cancelAnimation(scrollY);
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
            case "district":
                return (
                    <DistrictDetails
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

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace({
                pathname: "/(protected)/(tabs)",
            });
        }
    };

    return (
        <View style={staticStyles.container}>
            {/* Loading header */}
            {isLoading && !isError && <HeaderLoader />}

            {/* Minimized header that appears on scroll - only when data is loaded */}
            {!isLoading && !isError && (
                <HeaderSection
                    scrollY={scrollY}
                    minimizedHeaderHeight={minimizedHeaderHeight}
                    scrollDistance={scrollDistance}
                    onBack={handleGoBack}
                    insets={insets}
                    data={fetchedData}
                    isInsideScrollView={false}
                />
            )}

            <Animated.ScrollView
                contentContainerStyle={[
                    isSouvenirDetail && { paddingBottom: 80 }, // Add padding for sticky buttons
                ]}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={!isLoading && !isError}
            >
                {/* Header inside scroll view - full width, no padding */}
                {!isLoading && !isError && (
                    <HeaderSection
                        scrollY={scrollY}
                        minimizedHeaderHeight={minimizedHeaderHeight}
                        scrollDistance={scrollDistance}
                        onBack={handleGoBack}
                        insets={insets}
                        data={fetchedData}
                        showOnlyMinimized={false}
                    />
                )}

                {/* Content sections with horizontal padding */}
                <View style={staticStyles.scrollViewContent}>
                    {getDetailsStructure}
                </View>
            </Animated.ScrollView>

            {/* Sticky Purchase Buttons - Only for souvenirs */}
            {isSouvenirDetail && fetchedData && (
                <StickyPurchaseButtons
                    inStock={fetchedData.in_stock}
                    souvenirIdentifier={identifier as string}
                />
            )}
        </View>
    );
};

export default React.memo(Details);
