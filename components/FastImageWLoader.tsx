import React, { useState, useCallback } from "react";
import {
    View,
    StyleSheet,
    ViewStyle,
    DimensionValue,
    ActivityIndicator,
} from "react-native";
import FastImage from "@d11/react-native-fast-image";
import { useRecyclingState } from "@shopify/flash-list";

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
    indicatorSize?: "small" | "large" | number;
    onLoad?: () => void;
    onError?: () => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
}

const FastImageWLoader: React.FC<FastImageWLoaderProps> = React.memo(
    ({
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

        // Enhanced source with better caching
        const enhancedSource = {
            ...source,
        };

        return (
            <View
                style={[
                    styles.container,
                    { width, height, borderRadius },
                    style,
                ]}
            >
                {/* Show loading animation while image is loading */}
                {isLoading && !hasError && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator
                            size={indicatorSize}
                            color="#ffffff"
                        />
                    </View>
                )}

                {/* FastImage component */}
                <FastImage
                    source={enhancedSource}
                    style={[styles.image, { borderRadius }]}
                    resizeMode={resizeMode}
                    onLoadStart={handleLoadStart}
                    onLoad={handleLoad}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                />
            </View>
        );
    },
    (prevProps, nextProps) => {
        // Custom comparison function for React.memo
        return (
            prevProps.source.uri === nextProps.source.uri &&
            prevProps.width === nextProps.width &&
            prevProps.height === nextProps.height &&
            prevProps.borderRadius === nextProps.borderRadius &&
            prevProps.resizeMode === nextProps.resizeMode &&
            prevProps.indicatorSize === nextProps.indicatorSize &&
            JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
        );
    }
);

// Set display name for better debugging
FastImageWLoader.displayName = "FastImageWLoader";

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
    image: {
        width: "100%",
        height: "100%",
    },
});

export default FastImageWLoader;
