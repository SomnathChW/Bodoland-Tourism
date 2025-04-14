import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Dimensions, InteractionManager } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderSection from "@/components/UI/Details/HeaderSection";
import TitleSection from "@/components/UI/Details/TitleSection";
import AboutSection from "@/components/UI/Details/AboutSection";
import { DelayedComponentLoader } from "@/components/UI/Details/DelayedComponentLoader";
import FeaturesSection from "@/components/UI/Details/FeaturesSection";
import SimilarPlacesSection from "@/components/UI/Details/SimilarPlacesSection";

const { height } = Dimensions.get("screen");
const HEADER_MAX_HEIGHT = height * 0.45;
const HEADER_MIN_HEIGHT = 55;

const Details = () => {
    const params = useLocalSearchParams();
    const identifier = params?.identifier || "Sample Place";
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // State for phased loading
    const [animationPhase, setAnimationPhase] = useState(0); // 0: initial, 1: basic, 2: full
    const [showSimilar, setShowSimilar] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);

    // Performance tracking
    const isInitialRender = useRef(true);

    const minimizedHeaderHeight = HEADER_MIN_HEIGHT + insets.top;
    const scrollDistance = HEADER_MAX_HEIGHT - minimizedHeaderHeight;

    // Animation values
    const scrollY = useSharedValue(0);
    const isReady = useSharedValue(0);

    // Optimized scroll handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            scrollY.value = event.contentOffset.y;
        },
    });

    // Progressive loading strategy
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;

            // Phase 1: Minimal UI with basic animations
            requestAnimationFrame(() => {
                isReady.value = 0.6;
                setAnimationPhase(1);

                // Phase 2: Enable full animations after navigation completes
                InteractionManager.runAfterInteractions(() => {
                    setAnimationPhase(2);
                    isReady.value = 1;

                    setShowFeatures(true);
                    setShowSimilar(true);
                });
            });
        }

        return () => {
            cancelAnimation(scrollY);
            cancelAnimation(isReady);
        };
    }, [isReady]);

    // Static styles calculated once
    const staticStyles = React.useMemo(
        () => ({
            scrollContentContainer: {
                paddingTop: HEADER_MAX_HEIGHT,
            },
        }),
        []
    );

    return (
        <View style={styles.container}>
            <HeaderSection
                scrollY={scrollY}
                isReady={isReady}
                animationPhase={animationPhase}
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
                <TitleSection identifier={identifier as string} />
                <AboutSection />

                {/* Delayed loading for Features */}
                <DelayedComponentLoader shouldRender={showFeatures} delay={50}>
                    <FeaturesSection />
                </DelayedComponentLoader>

                {/* Delayed loading for Similar Places */}
                <DelayedComponentLoader shouldRender={showSimilar} delay={50}>
                    <SimilarPlacesSection />
                </DelayedComponentLoader>
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
