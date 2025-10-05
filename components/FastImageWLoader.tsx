import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import FastImage from "@d11/react-native-fast-image";
import { useRecyclingState } from "@shopify/flash-list";
import LottieView from "lottie-react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from "react-native-reanimated";
interface FastImageWLoaderProps {
    source: {
        uri: string;
        priority?: any;
        cache?: any;
    };
    style?: ViewStyle;
    resizeMode?: any;
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    indicatorSize?: "small" | "large";
    onLoad?: () => void;
    onError?: () => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
}

const FastImageWLoader: React.FC<FastImageWLoaderProps> = ({
    source,
    style,
    resizeMode = FastImage.resizeMode.cover,
    width = "100%",
    height = "100%",
    borderRadius = 0,
    indicatorSize = "small",
    onError,
    onLoadStart,
    onLoadEnd,
}) => {
    // Use FlashList's useRecyclingState hook to handle state properly during recycling
    const [hasError, setHasError] = useRecyclingState(false, [source.uri]);
    const [showLoader, setShowLoader] = useRecyclingState(true, [source.uri]);

    const imageOpacity = useSharedValue(0);
    const loaderOpacity = useSharedValue(1);

    useEffect(() => {
        imageOpacity.value = 0;
        loaderOpacity.value = 1;
        setShowLoader(true);
    }, [source.uri]);

    const loaderAnimatedStyle = useAnimatedStyle(() => ({
        opacity: loaderOpacity.value,
    }));

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
    }));

    const handleLoadStart = useCallback(() => {
        imageOpacity.value = 0;
        loaderOpacity.value = 1;
        setShowLoader(true);
        onLoadStart?.();
        setHasError(false);
    }, [onLoadStart, imageOpacity]);

    const handleLoadEnd = useCallback(() => {
        imageOpacity.value = withTiming(1, {
            duration: 250,
            easing: Easing.inOut(Easing.ease),
        });
        loaderOpacity.value = withDelay(
            100,
            withTiming(
                0,
                {
                    duration: 250,
                },
                (finished) => {
                    if (finished) {
                        runOnJS(setShowLoader)(false);
                    }
                }
            )
        );
        onLoadEnd?.();
    }, [onLoadEnd, imageOpacity]);

    const handleError = useCallback(() => {
        setHasError(true);
        onError?.();
    }, [onError]);

    return (
        <View
            style={[styles.container, { width, height, borderRadius }, style]}
        >
            {/* Render loading animation and unmount after fade completes */}
            {showLoader && !hasError && (
                <Animated.View
                    style={[styles.loaderContainer, loaderAnimatedStyle]}
                    pointerEvents="none"
                >
                    <LottieView
                        source={require("../assets/lottie/loading-spinner.json")}
                        autoPlay
                        loop
                        style={
                            indicatorSize === "small"
                                ? styles.lottieSmall
                                : styles.lottie
                        }
                    />
                </Animated.View>
            )}

            {/* FastImage component */}
            <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
                <FastImage
                    source={source}
                    style={[styles.image, { borderRadius }]}
                    resizeMode={resizeMode}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                />
            </Animated.View>
        </View>
    );
};

const arePropsEqual = (
    prevProps: FastImageWLoaderProps,
    nextProps: FastImageWLoaderProps
) => {
    if (prevProps.source.uri !== nextProps.source.uri) return false;
    if (prevProps.width !== nextProps.width) return false;
    if (prevProps.height !== nextProps.height) return false;
    if (prevProps.borderRadius !== nextProps.borderRadius) return false;
    if (prevProps.resizeMode !== nextProps.resizeMode) return false;
    if (prevProps.indicatorSize !== nextProps.indicatorSize) return false;

    const prevStyle = prevProps.style || {};
    const nextStyle = nextProps.style || {};
    return prevStyle === nextStyle; // Reference equality check
};

const MemoizedFastImageWLoader = React.memo(FastImageWLoader, arePropsEqual);

MemoizedFastImageWLoader.displayName = "FastImageWLoader";

const styles = StyleSheet.create({
    container: {
        position: "relative",
        overflow: "hidden",
    },
    loaderContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#1a2029", // Light background like attraction details cards
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    imageContainer: {
        width: "100%",
        height: "100%",
    },
    lottie: {
        width: 120,
        height: 120,
        opacity: 0.7,
    },
    lottieSmall: {
        width: 60,
        height: 60,
        opacity: 0.7,
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

export default MemoizedFastImageWLoader;
