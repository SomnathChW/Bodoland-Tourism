import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    ReduceMotion,
    withTiming,
} from "react-native-reanimated";
import ShowMoreCard from "./ShowMoreCard";

type QuickLinksProps = {
    subHeading?: string;
    data: any[];
    cardComponent: React.ElementType;
    viewAll?: () => void;
    style?: any;
    itemsPerRow?: number;
};

const { width } = Dimensions.get("screen");

const QuickLinks = React.memo(
    ({
        subHeading,
        data,
        cardComponent: CardComponent,
        viewAll,
        style,
        itemsPerRow = 4, // Default to 4 items per row
    }: QuickLinksProps) => {
        const [expanded, setExpanded] = useState(false);

        // Animation values
        const height = useSharedValue(0);
        const opacity = useSharedValue(0);

        // Calculate items to show in first row (3 items + show more button)
        const visibleItemsCount = itemsPerRow - 1;

        // Memoize this calculation since screen width rarely changes
        const getRowHeight = React.useMemo(() => {
            return (screenWidth: number) => {
                const DIMENSION_RATIO = 0.17;
                const cardSize = Math.ceil(screenWidth * DIMENSION_RATIO);
                const verticalPadding = 4 + 18;
                const bottomMargin = 15;
                return cardSize + verticalPadding + bottomMargin;
            };
        }, []);

        // Memoize the data splitting to prevent unnecessary recalculations
        const { firstRowItems, remainingItems, targetHeight } = useMemo(() => {
            // Get first row items and remaining items
            const firstItems = data.slice(0, visibleItemsCount);
            const remainingItems = data.slice(visibleItemsCount);

            // Calculate the target height for the hidden content
            const targetHeight =
                Math.ceil(remainingItems.length / itemsPerRow) *
                getRowHeight(width);

            return { firstRowItems: firstItems, remainingItems, targetHeight };
        }, [data, visibleItemsCount, itemsPerRow, width]);

        // Memoize the toggle function to prevent recreating on each render
        const toggleExpanded = useCallback(() => {
            if (expanded) {
                // Collapse
                height.value = withTiming(0, {
                    duration: 100,
                    reduceMotion: ReduceMotion.Never,
                });
                opacity.value = withTiming(0, {
                    duration: 150,
                    reduceMotion: ReduceMotion.Never,
                });
            } else {
                // Expand using the calculated target height
                height.value = withTiming(targetHeight, {
                    duration: 100,
                    reduceMotion: ReduceMotion.Never,
                });
                opacity.value = withTiming(1, {
                    duration: 50,
                    reduceMotion: ReduceMotion.Never,
                });
            }
            setExpanded(!expanded);
        }, [expanded, height, opacity, targetHeight]);

        // Memoize animated style to prevent recreating on each render
        const hiddenContentStyle = useAnimatedStyle(() => ({
            height: height.value,
            opacity: opacity.value,
            overflow: "hidden",
        }));

        // Memoize the view all handler
        const handleViewAll = useCallback(() => {
            if (viewAll) {
                viewAll();
            }
        }, [viewAll]);

        // Memoize the rendering of first row items
        const firstRowItemsComponent = useMemo(
            () =>
                firstRowItems.map((item, index) => (
                    <View key={`visible-${index}`} style={styles.gridItem}>
                        <CardComponent item={item} />
                    </View>
                )),
            [firstRowItems, CardComponent]
        );

        // Memoize the rendering of remaining items
        const remainingItemsComponent = useMemo(
            () =>
                remainingItems.map((item, index) => (
                    <View key={`hidden-${index}`} style={styles.gridItem}>
                        <CardComponent item={item} />
                    </View>
                )),
            [remainingItems, CardComponent]
        );

        return (
            <View style={[style]}>
                <View style={styles.mainBodyPaddingView}>
                    <View style={styles.subHeaddingView}>
                        {subHeading && (
                            <Text style={styles.subHeaddings}>
                                {subHeading}
                            </Text>
                        )}
                        {viewAll && (
                            <Text style={styles.links} onPress={handleViewAll}>
                                View More
                            </Text>
                        )}
                    </View>
                </View>

                {/* First row with items and Show More button */}
                <View style={styles.gridContainer}>
                    {firstRowItemsComponent}

                    {/* Show More button as the last item in the first row */}
                    <View style={styles.gridItem}>
                        <ShowMoreCard
                            expanded={expanded}
                            toggleExpanded={toggleExpanded}
                        />
                    </View>
                </View>

                {/* Animated hidden content shown */}
                <Animated.View style={hiddenContentStyle}>
                    <View style={styles.gridContainer}>
                        {remainingItemsComponent}
                    </View>
                </Animated.View>
            </View>
        );
    }
);

// Styles remain the same
const styles = StyleSheet.create({
    mainBodyPaddingView: {
        paddingHorizontal: 20,
    },
    subHeaddingView: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    subHeaddings: {
        fontFamily: "SfProMedium",
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    links: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        color: "#646f7e",
        paddingTop: 5,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
    },
    gridItem: {
        width: "25%", // 4 items per row
        marginBottom: 15,
        alignItems: "center",
    },
    measureContainer: {
        position: "absolute",
        opacity: 0,
        zIndex: -1,
    },
});

export default QuickLinks;
