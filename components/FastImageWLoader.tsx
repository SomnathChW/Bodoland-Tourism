import React, { useState, useCallback } from "react";
import { View, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import FastImage from "@d11/react-native-fast-image";
import { useRecyclingState } from "@shopify/flash-list";
import LottieView from "lottie-react-native";

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
    onLoad,
    onError,
    onLoadStart,
    onLoadEnd,
}) => {
    // Use FlashList's useRecyclingState hook to handle state properly during recycling
    const [isLoading, setIsLoading] = useRecyclingState(true, [source.uri]);
    const [hasError, setHasError] = useRecyclingState(false, [source.uri]);

    const handleLoadStart = useCallback(() => {
        setIsLoading(true);
        setHasError(false);
        onLoadStart?.();
    }, [onLoadStart]);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        onLoad?.();
    }, [onLoad]);

    const handleLoadEnd = useCallback(() => {
        setIsLoading(false);
        onLoadEnd?.();
    }, [onLoadEnd]);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
    }, [onError]);

    return (
        <View
            style={[styles.container, { width, height, borderRadius }, style]}
        >
            {/* Show loading animation while image is loading */}
            {isLoading && !hasError && (
                <View style={styles.loaderContainer}>
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
                </View>
            )}

            {/* FastImage component */}
            <FastImage
                source={source}
                style={[styles.image, { borderRadius }]}
                resizeMode={resizeMode}
                onLoadStart={handleLoadStart}
                onLoad={handleLoad}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
            />
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

    // Simple style comparison for common properties
    const prevStyle = prevProps.style || {};
    const nextStyle = nextProps.style || {};
    return prevStyle === nextStyle; // Reference equality check
};

// Apply the optimized memoization
const MemoizedFastImageWLoader = React.memo(FastImageWLoader, arePropsEqual);

// Set display name for better debugging
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
