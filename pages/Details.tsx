import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderSection from "@/components/UI/Details/Common/HeaderSection";

// Import data
import AttractionDetails from "@/components/UI/Details/AttractionDetails/AttractionDetails";
import SouvenirDetails from "@/components/UI/Details/SouvenirDetails/SouvenirDetails";
import StayDetails from "@/components/UI/Details/StayDetails/StayDetails";
import FestivalDetails from "@/components/UI/Details/FestivalDetails/FestivalDetails";
import CuisineDetails from "@/components/UI/Details/CuisineDetails/CuisineDetails";
import TransportDetails from "@/components/UI/Details/TransportDetails/TransportDetails";

const { height } = Dimensions.get("screen");
const HEADER_MAX_HEIGHT = height * 0.45;
const HEADER_MIN_HEIGHT = 55;

const Details = () => {
    const params = useLocalSearchParams();
    const identifier = params?.identifier || "Sample Place";
    const router = useRouter();
    const insets = useSafeAreaInsets();

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
                return <AttractionDetails identifier={identifier} />;
            case "souvenir":
                return <SouvenirDetails identifier={identifier} />;
            case "stay":
                return <StayDetails identifier={identifier} />;
            case "festival":
                return <FestivalDetails identifier={identifier} />;
            case "cuisine":
                return <CuisineDetails identifier={identifier} />;
            case "transport":
                return <TransportDetails identifier={identifier} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <HeaderSection
                scrollY={scrollY}
                isReady={isReady}
                animationPhase={2}
                hasModel={true}
                minimizedHeaderHeight={minimizedHeaderHeight}
                scrollDistance={scrollDistance}
                identifier={identifier as string}
                onBack={() => router.back()}
                insets={insets}
            />

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
                {/* Render sections based on structure */}
                {getDetailsStructure(identifier as string)}
            </Animated.ScrollView>
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
