import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import React, { useEffect, useRef, useCallback } from "react";
import CarouselCard from "./CarouselCard";
import CarouselLoader from "./CarouselLoader";
import { useFocusEffect } from "expo-router";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    useDerivedValue,
    SharedValue,
    cancelAnimation,
} from "react-native-reanimated";

import { scheduleOnRN } from "react-native-worklets";

const AUTO_SCROLL_INTERVAL = 5000; // 5 seconds

const { width } = Dimensions.get("screen");

export type CarouselItemType = "details" | "browser" | "none";
export interface CarouselTypes {
    identifier: string;
    name: string;
    image: any;
    description: string;
    tag?: string;
    promo_url?: string;
    type: CarouselItemType;
}

interface CarouselProps {
    data?: CarouselTypes[];
    isLoading?: boolean;
}

const Carousel = React.memo(
    ({ data = [], isLoading = false }: CarouselProps) => {
        const scrollX = useSharedValue(0);
        const flatListRef = useRef<FlatList>(null);
        const scrollPosition = useSharedValue(0);
        const progressValue = useSharedValue(0);
        const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
        const isComponentMounted = useRef(true);

        const itemList = data;

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
            if (!isComponentMounted.current) return;
            cancelAnimation(progressValue);
            progressValue.value = withTiming(1, {
                duration: AUTO_SCROLL_INTERVAL,
            });
        }, [progressValue]);

        const resetProgress = React.useCallback(() => {
            if (!isComponentMounted.current) return;
            cancelAnimation(progressValue);
            progressValue.value = 0;
        }, [progressValue]);

        const autoScroll = React.useCallback(() => {
            if (
                !isComponentMounted.current ||
                !flatListRef.current ||
                sortedItemList.length === 0
            )
                return;

            try {
                const nextIndex =
                    (Math.floor(scrollPosition.value) + 1) %
                    sortedItemList.length;
                flatListRef.current.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
                scrollPosition.value = nextIndex;
                scheduleOnRN(resetProgress);
                scheduleOnRN(startProgressAnimation);
            } catch (error) {
                // Handle scroll errors gracefully
                console.log("Carousel scroll error:", error);
            }
        }, [sortedItemList.length, resetProgress, startProgressAnimation]);

        const resetAutoScrollInterval = React.useCallback(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (isComponentMounted.current && sortedItemList.length > 0) {
                intervalRef.current = setInterval(
                    autoScroll,
                    AUTO_SCROLL_INTERVAL
                );
            }
        }, [autoScroll, sortedItemList.length]);

        const keyExtractor = React.useCallback(
            (item: CarouselTypes, index: number) => `${item.name}-${index}`,
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
                if (!isComponentMounted.current) return;

                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const currentIndex = Math.round(contentOffsetX / width);
                scrollPosition.value = currentIndex;
                // Reset progress and timer when user manually scrolls
                resetProgress();
                startProgressAnimation();
                resetAutoScrollInterval();
            },
            [resetProgress, startProgressAnimation, resetAutoScrollInterval]
        );

        // Handle component focus/blur for better performance
        useFocusEffect(
            useCallback(() => {
                isComponentMounted.current = true;
                if (sortedItemList.length > 0) {
                    startProgressAnimation();
                    resetAutoScrollInterval();
                }

                return () => {
                    isComponentMounted.current = false;
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    cancelAnimation(progressValue);
                };
            }, [
                sortedItemList.length,
                startProgressAnimation,
                resetAutoScrollInterval,
                progressValue,
            ])
        );

        useEffect(() => {
            return () => {
                // Cleanup on unmount
                isComponentMounted.current = false;
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                cancelAnimation(progressValue);
            };
        }, [progressValue]);

        const renderItem = React.useCallback(
            ({ item, index }: { item: CarouselTypes; index: number }) => (
                <CarouselCard item={item} index={index} scrollX={scrollX} />
            ),
            [scrollX]
        );

        if (isLoading) {
            return <CarouselLoader />;
        }

        if (sortedItemList.length === 0) {
            return <View style={styles.container} />;
        }

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
                    windowSize={3}
                    maxToRenderPerBatch={1}
                    updateCellsBatchingPeriod={100}
                    scrollEventThrottle={16}
                />

                {/* Dot Indicators */}
                <View style={styles.indicatorContainer}>
                    {sortedItemList.map((_, index) => (
                        <DotIndicator
                            key={index}
                            index={index}
                            progressValue={progressValue}
                            scrollPosition={scrollPosition}
                        />
                    ))}
                </View>
            </View>
        );
    }
);

// Separate component for animated dot indicators
const DotIndicator = React.memo(
    ({
        index,
        progressValue,
        scrollPosition,
    }: {
        index: number;
        progressValue: SharedValue<number>;
        scrollPosition: SharedValue<number>;
    }) => {
        const isCurrentActive = useDerivedValue(() => {
            return Math.floor(scrollPosition.value) === index;
        }, [index]);

        const progressStyle = useAnimatedStyle(() => {
            if (isCurrentActive.value) {
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
            return {
                width: isCurrentActive.value ? 60 : 4,
                backgroundColor: isCurrentActive.value
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
