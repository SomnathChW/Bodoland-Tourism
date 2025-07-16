import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderSection from "@/components/UI/Details/Common/HeaderSection";
import HeaderLoader from "@/components/HeaderLoader";

// Import data
import AttractionDetails from "@/components/UI/Details/AttractionDetails/AttractionDetails";
import SouvenirDetails from "@/components/UI/Details/SouvenirDetails/SouvenirDetails";
import StayDetails from "@/components/UI/Details/StayDetails/StayDetails";
import FestivalDetails from "@/components/UI/Details/FestivalDetails/FestivalDetails";
import CuisineDetails from "@/components/UI/Details/CuisineDetails/CuisineDetails";
import TransportDetails from "@/components/UI/Details/TransportDetails/TransportDetails";
import StickyPurchaseButtons from "@/components/UI/Details/SouvenirDetails/StickyPurchaseButtons";

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

    // Scroll handler
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
            cancelAnimation(isReady);
        };
    }, []);

    // Handler for when data is fetched
    const handleDataFetched = (data: any) => {
        setFetchedData(data);
        setIsLoading(false);
    };

    // Handler for error cases
    const handleFetchError = () => {
        setIsLoading(false);
        setIsError(true);
    };

    // Static styles calculated once
    const staticStyles = React.useMemo(
        () => ({
            scrollContentContainer: {
                paddingTop: HEADER_MAX_HEIGHT,
            },
        }),
        []
    );

    // Function to return structure based on identifier
    const getDetailsStructure = (identifier: string) => {
        const detail_type = identifier.split(/[-_]/)[0].toLowerCase();
        switch (detail_type) {
            case "attraction":
                return (
                    <AttractionDetails
                        identifier={identifier}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
            case "souvenir":
                return (
                    <SouvenirDetails
                        identifier={identifier}
                        onDataFetched={handleDataFetched}
                    />
                );
            case "stay":
                return <StayDetails identifier={identifier} />;
            case "festival":
                return (
                    <FestivalDetails
                        identifier={identifier}
                        onDataFetched={handleDataFetched}
                    />
                );
            case "cuisine":
                return (
                    <CuisineDetails
                        identifier={identifier}
                        onDataFetched={handleDataFetched}
                    />
                );
            case "transport":
                return <TransportDetails identifier={identifier} />;
            default:
                return (
                    <AttractionDetails
                        identifier={identifier}
                        onDataFetched={handleDataFetched}
                        onError={handleFetchError}
                    />
                );
        }
    };

    // Check if current page is for souvenirs
    const isSouvenirDetail =
        (identifier as string).split(/[-_]/)[0].toLowerCase() === "souvenir";

    return (
        <View style={styles.container}>
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
                    styles.scrollViewContent,
                    staticStyles.scrollContentContainer,
                    isSouvenirDetail && { paddingBottom: 80 }, // Add padding for sticky buttons
                ]}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                overScrollMode="never"
                keyboardShouldPersistTaps="handled"
                scrollEnabled={!isLoading && !isError}
            >
                {/* Render sections based on structure */}
                {getDetailsStructure(identifier as string)}
            </Animated.ScrollView>

            {/* Sticky Purchase Buttons - Only for souvenirs */}
            {isSouvenirDetail && fetchedData && (
                <StickyPurchaseButtons inStock={fetchedData.in_stock} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    scrollViewContent: {
        paddingHorizontal: 20,
    },
});

export default Details;
