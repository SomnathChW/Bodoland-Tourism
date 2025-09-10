import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    SharedValue,
    FadeIn,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { EdgeInsets } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import { ModelViewer } from "../ModelViewer/ModelViewer";
import FastImageWLoader from "@/components/FastImageWLoader";

interface HeaderSectionProps {
    scrollY: SharedValue<number>;
    animationPhase: number;
    minimizedHeaderHeight: number;
    scrollDistance: number;
    onBack: () => void;
    insets: EdgeInsets;
    data?: {
        name?: string;
        image_carousel?: string[];
        model_data?: string;
        model_image_url?: string;
    };
}

const HeaderSection = ({
    scrollY,
    animationPhase,
    minimizedHeaderHeight,
    scrollDistance,
    onBack,
    insets,
    data,
}: HeaderSectionProps) => {
    // State for dynamic images from data
    const [displayImages, setDisplayImages] = useState<string[]>([]);
    const [model, setModel] = useState<string | null>(null);
    const [modelImageUrl, setModelImageUrl] = useState<string | null>(null);
    const [hasModel, setHasModel] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    // Update images and model when data is received
    useEffect(() => {
        if (data?.image_carousel && data.image_carousel.length > 0) {
            setDisplayImages(data.image_carousel);
        }
        if (data?.model_data && typeof data.model_image_url === "string") {
            setModelImageUrl(data.model_image_url);
            setModel(data.model_data);
            setHasModel(true);
            setCurrentPage(1); // Set to model page when model is available
        } else {
            setHasModel(false);
            setCurrentPage(0); // Set to first image when no model
        }
    }, [data]);

    // Optimized derived animations with worklet - Combined for better performance
    const headerHeight = useDerivedValue(() => {
        "worklet";
        const scrollValue = scrollY.value;
        const scrollProgress = scrollValue / scrollDistance;
        const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
        return HEADER_MAX_HEIGHT - scrollDistance * clampedProgress;
    }, [scrollDistance]);

    const imageAnimations = useDerivedValue(() => {
        "worklet";
        const scrollValue = scrollY.value;
        const scrollProgress = scrollValue / scrollDistance;
        const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);

        return {
            opacity: 1 - clampedProgress,
            scale: 1 + 0.2 * clampedProgress,
        };
    }, [scrollDistance]);

    const uiAnimations = useDerivedValue(() => {
        "worklet";
        const scrollValue = scrollY.value;
        const scrollProgress = scrollValue / scrollDistance;

        return {
            minimizedHeaderOpacity:
                scrollProgress > 0.7 ? (scrollProgress - 0.7) / 0.3 : 0,
            backButtonOpacity:
                scrollProgress > 0.5 ? 0 : 1 - scrollProgress * 2,
        };
    }, [scrollDistance]);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            height: headerHeight.value,
        };
    }, []);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            opacity: imageAnimations.value.opacity,
            transform: [{ scale: imageAnimations.value.scale }],
        };
    }, []);

    const minimizedHeaderStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            opacity: uiAnimations.value.minimizedHeaderOpacity,
        };
    }, []);

    const floatingBackButtonStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            opacity: uiAnimations.value.backButtonOpacity,
        };
    }, []);

    // Static styles
    const staticStyles = useMemo(
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

    // Define types for pages
    type ModelPage = {
        type: "model";
        model_url: string;
        model_image_url: string;
    };
    type ImagePage = { type: "image"; uri: string };
    type Page = ModelPage | ImagePage;

    // Memoized page component for better performance
    const renderPage = useCallback((page: Page, index: number) => {
        return (
            <View key={index} style={styles.pageContainer}>
                {page.type === "model" ? (
                    <ModelViewer
                        scale={3}
                        model={page.model_url}
                        model_image_url={page.model_image_url}
                    />
                ) : page.type === "image" ? (
                    <FastImageWLoader
                        source={{
                            uri: page.uri,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.web,
                        }}
                        style={styles.carouselImage}
                        resizeMode={FastImage.resizeMode.cover}
                        indicatorSize={"large"}
                    />
                ) : null}
            </View>
        );
    }, []);

    const pages: Page[] = useMemo(() => {
        return hasModel
            ? [
                  {
                      type: "model",
                      model_url: model || "",
                      model_image_url: modelImageUrl || "",
                  } as ModelPage,
                  ...displayImages.map(
                      (uri): ImagePage => ({ type: "image", uri })
                  ),
              ]
            : displayImages.map((uri): ImagePage => ({ type: "image", uri }));
    }, [hasModel, model, modelImageUrl, displayImages]);

    return (
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
            {/* Header Image - Wrapper for layout animation */}
            <Animated.View entering={FadeIn.duration(250)}>
                <Animated.View
                    style={animationPhase >= 2 ? imageAnimatedStyle : {}}
                >
                    <PagerView
                        key={`pager-${hasModel}`}
                        style={[
                            styles.headerImage,
                            { height: styles.headerImage.height },
                        ]}
                        initialPage={hasModel ? 1 : 0}
                        onPageSelected={(e) =>
                            setCurrentPage(e.nativeEvent.position)
                        }
                        // Performance optimizations
                        offscreenPageLimit={1}
                        overdrag={false}
                        scrollEnabled={true}
                        pageMargin={0}
                    >
                        {pages.map((page, index) => renderPage(page, index))}
                    </PagerView>

                    {/* Page indicators */}
                    <View style={styles.indicatorContainer}>
                        {pages.map((page, index) => {
                            const isActive = currentPage === index;

                            if (page.type === "model") {
                                return (
                                    <MaterialCommunityIcons
                                        key={index}
                                        name="augmented-reality"
                                        size={isActive ? 16 : 12}
                                        color={
                                            isActive
                                                ? "white"
                                                : "rgba(255, 255, 255, 0.5)"
                                        }
                                        style={{ marginHorizontal: 4 }}
                                    />
                                );
                            }

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        isActive && styles.activeIndicator,
                                    ]}
                                />
                            );
                        })}
                    </View>
                </Animated.View>
            </Animated.View>

            {/* Minimized Header (appears when scrolling) */}
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
                    {data?.name || ""}
                </Text>
                <View style={styles.headerRightPlaceholder} />
            </Animated.View>

            {/* Floating Back Button */}
            <Animated.View
                style={[
                    styles.floatingBackButton,
                    staticStyles.floatingBackButtonContainer,
                    floatingBackButtonStyle,
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

    pageContainer: {
        flex: 1,
    },
    modelContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    carouselImage: {
        width: "100%",
        height: "100%",
    },
    indicatorContainer: {
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    indicator: {
        width: 4,
        height: 4,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: "white",
        width: 12, // Wider selected indicator
        height: 4,
        borderRadius: 4,
    },
});

export default memo(HeaderSection);
