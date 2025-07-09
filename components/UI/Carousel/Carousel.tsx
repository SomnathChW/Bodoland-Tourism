import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";
import { CarouselTypes } from "@/data/slider_data";
import CarouselCard from "./CarouselCard";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from "react-native-reanimated";

type Props = {
    itemList: CarouselTypes[];
};

const AUTO_SCROLL_INTERVAL = 5000; // 5 seconds

const { width } = Dimensions.get("screen");

const Carousel = React.memo(({ itemList }: Props) => {
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollPosition = useSharedValue(0);
    const progressValue = useSharedValue(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const sortedItemList = React.useMemo(() => {
        return [...itemList].sort((a, b) => {
            if (a.tag && !b.tag) return -1;
            if (!a.tag && b.tag) return 1;
            return 0;
        });
    }, [itemList]);

    const startProgressAnimation = React.useCallback(() => {
        progressValue.value = withTiming(1, { duration: AUTO_SCROLL_INTERVAL });
    }, []);

    const resetProgress = React.useCallback(() => {
        progressValue.value = 0;
    }, []);

    const autoScroll = React.useCallback(() => {
        if (flatListRef.current) {
            const nextIndex =
                (Math.floor(scrollPosition.value) + 1) % sortedItemList.length;
            flatListRef.current.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            scrollPosition.value = nextIndex;
            runOnJS(resetProgress)();
            runOnJS(startProgressAnimation)();
        }
    }, [sortedItemList.length, resetProgress, startProgressAnimation]);

    const keyExtractor = React.useCallback(
        (item: CarouselTypes, index: number) => `${item.title}-${index}`,
        []
    );

    const getItemLayout = React.useCallback(
        (data: any, index: number) => ({
            length: width,
            offset: width * index,
            index,
        }),
        []
    );

    const onMomentumScrollEnd = React.useCallback(
        (event: any) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const currentIndex = Math.round(contentOffsetX / width);
            scrollPosition.value = currentIndex;
            // Reset progress when user manually scrolls
            runOnJS(resetProgress)();
            runOnJS(startProgressAnimation)();
        },
        [resetProgress, startProgressAnimation]
    );

    useEffect(() => {
        // Start initial progress animation
        startProgressAnimation();

        intervalRef.current = setInterval(autoScroll, AUTO_SCROLL_INTERVAL);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoScroll, startProgressAnimation]);

    const renderItem = React.useCallback(
        ({ item, index }: { item: CarouselTypes; index: number }) => (
            <CarouselCard item={item} index={index} scrollX={scrollX} />
        ),
        [scrollX]
    );

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                data={sortedItemList}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScrollHandler}
                removeClippedSubviews={false}
                initialScrollIndex={0}
                getItemLayout={getItemLayout}
                onMomentumScrollEnd={onMomentumScrollEnd}
            />

            {/* Dot Indicators */}
            <View style={styles.indicatorContainer}>
                {sortedItemList.map((_, index) => {
                    const currentIndex = Math.floor(scrollPosition.value);
                    const isActive = currentIndex === index;

                    return (
                        <DotIndicator
                            key={index}
                            index={index}
                            isActive={isActive}
                            progressValue={progressValue}
                            scrollPosition={scrollPosition}
                        />
                    );
                })}
            </View>
        </View>
    );
});

// Separate component for animated dot indicators
const DotIndicator = React.memo(
    ({
        index,
        isActive,
        progressValue,
        scrollPosition,
    }: {
        index: number;
        isActive: boolean;
        progressValue: Animated.SharedValue<number>;
        scrollPosition: Animated.SharedValue<number>;
    }) => {
        const progressStyle = useAnimatedStyle(() => {
            const currentIndex = Math.floor(scrollPosition.value);
            const isCurrentActive = currentIndex === index;

            if (isCurrentActive) {
                const progress = progressValue.value;
                return {
                    width: `${progress * 100}%`,
                };
            } else {
                return {
                    width: "0%",
                };
            }
        });

        const containerStyle = useAnimatedStyle(() => {
            const currentIndex = Math.floor(scrollPosition.value);
            const isCurrentActive = currentIndex === index;

            return {
                width: isCurrentActive ? 20 : 4,
                backgroundColor: isCurrentActive
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(255, 255, 255, 0.5)",
            };
        });

        return (
            <Animated.View style={[styles.indicator, containerStyle]}>
                <Animated.View style={[styles.progressBar, progressStyle]} />
            </Animated.View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    indicator: {
        height: 4,
        borderRadius: 2,
        marginHorizontal: 2,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: 2,
    },
});

export default Carousel;
