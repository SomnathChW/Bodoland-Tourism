import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    ReduceMotion,
    withSpring,
} from "react-native-reanimated";
import ShowMoreCard from "./ShowMoreCard";

type QuickLinksProps = {
    subHeading?: string;
    data: any[]; // Adjust the type as needed
    cardComponent: React.ElementType;
    viewAll?: () => void;
    style?: any;
    itemsPerRow?: number;
};

const { width } = Dimensions.get("screen");

const getRowHeight = (screenWidth: number) => {
    const DIMENSION_RATIO = 0.17;
    const cardSize = Math.ceil(screenWidth * DIMENSION_RATIO);
    const verticalPadding = 4 + 18;
    const bottomMargin = 15;
    return cardSize + verticalPadding + bottomMargin;
};

const QuickLinks = ({
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

    // Get first row items and remaining items
    const firstRowItems = data.slice(0, visibleItemsCount);
    const remainingItems = data.slice(visibleItemsCount);

    // Calculate the target height for the hidden content by
    // multiplying the number of rows by the row height
    const targetHeight =
        Math.ceil(remainingItems.length / itemsPerRow) * getRowHeight(width);

    const toggleExpanded = () => {
        if (expanded) {
            // Collapse
            height.value = withSpring(0, {
                duration: 200,
                dampingRatio: 1,
                stiffness: 1,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 2,
                reduceMotion: ReduceMotion.Never,
            });
            opacity.value = withSpring(0, {
                duration: 300,
                dampingRatio: 1,
                stiffness: 1,
                overshootClamping: true,
                reduceMotion: ReduceMotion.Never,
            });
        } else {
            // Expand using the calculated target height
            height.value = withSpring(targetHeight, {
                duration: 200,
                dampingRatio: 1,
                stiffness: 1,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 2,
                reduceMotion: ReduceMotion.Never,
            });
            opacity.value = withSpring(1, {
                duration: 150,
                dampingRatio: 1,
                stiffness: 1,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 2,
                reduceMotion: ReduceMotion.Never,
            });
        }
        setExpanded(!expanded);
    };

    // Animated style for the hidden content
    const hiddenContentStyle = useAnimatedStyle(() => ({
        height: height.value,
        opacity: opacity.value,
        overflow: "hidden",
    }));

    return (
        <View style={[style]}>
            <View style={styles.mainBodyPaddingView}>
                <View style={styles.subHeaddingView}>
                    {subHeading && (
                        <Text style={styles.subHeaddings}>{subHeading}</Text>
                    )}
                    {viewAll && (
                        <Text style={styles.links} onPress={viewAll}>
                            View More
                        </Text>
                    )}
                </View>
            </View>

            {/* First row with items and Show More button */}
            <View style={styles.gridContainer}>
                {firstRowItems.map((item, index) => (
                    <View key={`visible-${index}`} style={styles.gridItem}>
                        <CardComponent item={item} />
                    </View>
                ))}

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
                    {remainingItems.map((item, index) => (
                        <View key={`hidden-${index}`} style={styles.gridItem}>
                            <CardComponent item={item} />
                        </View>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

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
