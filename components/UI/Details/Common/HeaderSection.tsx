import React, { useEffect, useState } from "react";
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
    FadeIn,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { EdgeInsets } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import { ModelViewer } from "../ModelViewer/ModelViewer";

interface HeaderSectionProps {
    scrollY: SharedValue<number>;
    isReady: SharedValue<number>;
    animationPhase: number;
    minimizedHeaderHeight: number;
    scrollDistance: number;
    onBack: () => void;
    insets: EdgeInsets;
    data?: any;
}

const carouselImages = [
    "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
    // Add more image URLs as needed
];

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
    const [displayImages, setDisplayImages] = useState(carouselImages);
    const [model, setModel] = useState<string | null>(null);
    const [modelImageUrl, setModelImageUrl] = useState<string | null>(null);
    const [hasModel, setHasModel] = useState(false);

    // Update images when data is received
    useEffect(() => {
        if (data?.image_carousel && data.image_carousel.length > 0) {
            setDisplayImages(data.image_carousel);
        }
        if (data?.model_data && typeof data.model_image_url === "string") {
            setModelImageUrl(data.model_image_url);
            setModel(data.model_data);
            setHasModel(true);
        }
    }, [data]);

    // Update current page when model availability changes
    useEffect(() => {
        setCurrentPage(hasModel ? 1 : 0);
    }, [hasModel]);

    // Optimized derived animations with worklet
    const animations = useDerivedValue(() => {
        "worklet";
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

    const [currentPage, setCurrentPage] = useState(hasModel ? 1 : 0);

    // Define types for pages
    type ModelPage = {
        type: "model";
        model_url: string;
        model_image_url: string;
    };
    type ImagePage = { type: "image"; uri: string };
    type Page = ModelPage | ImagePage;

    const pages: Page[] = hasModel
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
                    >
                        {pages.map((page, index) => (
                            <View key={index} style={styles.pageContainer}>
                                {page.type === "model" ? (
                                    <ModelViewer
                                        scale={3}
                                        model={page.model_url}
                                        model_image_url={page.model_image_url}
                                    />
                                ) : page.type === "image" ? (
                                    <FastImage
                                        source={{
                                            uri: page.uri,
                                            priority: FastImage.priority.high,
                                            cache: FastImage.cacheControl
                                                .immutable,
                                        }}
                                        style={styles.carouselImage}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                ) : null}
                            </View>
                        ))}
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

export default HeaderSection;
