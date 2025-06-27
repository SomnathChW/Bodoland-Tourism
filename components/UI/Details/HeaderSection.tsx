import React, { useEffect } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    useDerivedValue,
    SharedValue,
    withTiming,
    useSharedValue,
    FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { EdgeInsets } from "react-native-safe-area-context";

interface HeaderSectionProps {
    scrollY: SharedValue<number>;
    isReady: SharedValue<number>;
    animationPhase: number;
    minimizedHeaderHeight: number;
    scrollDistance: number;
    identifier: string;
    onBack: () => void;
    insets: EdgeInsets;
}

const HeaderSection = ({
    scrollY,
    animationPhase,
    minimizedHeaderHeight,
    scrollDistance,
    identifier,
    onBack,
    insets,
}: HeaderSectionProps) => {
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

    // Create animated styles with worklets
    const headerAnimatedStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            height: animations.value.headerHeight,
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

    // Static styles
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
        }),
        [insets.top, minimizedHeaderHeight]
    );

    return (
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
            {/* Header Image - Wrapper for layout animation */}
            <Animated.View entering={FadeIn.duration(250)}>
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
            </Animated.View>

            {/* Minimized Header (appears when scrolling) */}
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
                        onPress={onBack}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.minimizedTitle} numberOfLines={1}>
                        {identifier}
                    </Text>
                    <View style={styles.headerRightPlaceholder} />
                </Animated.View>
            )}

            {/* Floating Back Button */}
            <Animated.View
                style={[
                    styles.floatingBackButton,
                    staticStyles.floatingBackButtonContainer,
                    animationPhase >= 2 ? floatingBackButtonStyle : {},
                ]}
            >
                <TouchableOpacity onPress={onBack} activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.45;

const styles = StyleSheet.create({
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
});

export default React.memo(HeaderSection);
