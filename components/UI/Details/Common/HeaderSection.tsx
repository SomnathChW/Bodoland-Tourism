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
    minimizedHeaderHeight: number;
    scrollDistance: number;
    onBack: () => void;
    insets: EdgeInsets;
    data?: {
        name?: string;
        image_carousel?: string[];
        model_data?: string;
        model_image_url?: string;
        price?: string;
        dimensions?: string;
        currency?: string;
    };
    showOnlyMinimized?: boolean;
    isInsideScrollView?: boolean;
}

const HeaderSection = ({
    scrollY,
    minimizedHeaderHeight,
    scrollDistance,
    onBack,
    insets,
    data,
    showOnlyMinimized = true,
    isInsideScrollView = true,
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

    // Only animation needed for minimized header opacity
    const minimizedHeaderStyle = useAnimatedStyle(() => {
        "worklet";
        const scrollValue = scrollY.value;
        const scrollProgress = scrollValue / scrollDistance;
        const opacity = scrollProgress > 0.3 ? (scrollProgress - 0.3) / 0.3 : 0;
        return {
            opacity,
        };
    }, [scrollDistance]);

    // Animation for floating back button opacity
    const floatingBackButtonStyle = useAnimatedStyle(() => {
        "worklet";
        const scrollValue = scrollY.value;
        const scrollProgress = scrollValue / scrollDistance;
        // Button should fade out as minimized header appears
        const opacity =
            scrollProgress > 0.15 ? 1 - (scrollProgress - 0.15) / 0.15 : 1;
        return {
            opacity,
        };
    }, [scrollDistance]);

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
                        souvenirName={data?.name}
                        souvenirPrice={data?.price}
                        souvenirDimensions={data?.dimensions}
                        currency={data?.currency}
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

    // If showing only minimized header (for fixed position)
    if (showOnlyMinimized) {
        return (
            <>
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

                {/* Absolutely positioned floating back button */}
                <Animated.View
                    style={[
                        styles.absoluteFloatingBackButton,
                        { top: insets.top + 10 },
                        floatingBackButtonStyle,
                    ]}
                >
                    <TouchableOpacity onPress={onBack} activeOpacity={0.8}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </>
        );
    }

    // If inside scroll view, render static header without animations
    if (isInsideScrollView) {
        return (
            <View style={[styles.staticHeader, { height: HEADER_MAX_HEIGHT }]}>
                {/* Header Image - Static version */}
                <Animated.View entering={FadeIn.duration(250)}>
                    <PagerView
                        key={`pager-${hasModel}`}
                        style={[
                            styles.headerImage,
                            { height: HEADER_MAX_HEIGHT },
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
            </View>
        );
    }
};

const HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.45;

const styles = StyleSheet.create({
    staticHeader: {
        overflow: "hidden",
        backgroundColor: "#0d1116",
        position: "relative",
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
    absoluteFloatingBackButton: {
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
