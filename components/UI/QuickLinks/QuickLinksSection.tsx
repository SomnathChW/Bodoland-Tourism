import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
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
        itemsPerRow = 4,
    }: QuickLinksProps) => {
        const [expanded, setExpanded] = useState(false);
        const contentHeight = useSharedValue(0);

        const visibleItemsCount = itemsPerRow - 1;

        const { firstRowItems, remainingItems } = useMemo(() => {
            const firstItems = data.slice(0, visibleItemsCount);
            const remainingItems = data.slice(visibleItemsCount);
            return { firstRowItems: firstItems, remainingItems };
        }, [data, visibleItemsCount]);

        const toggleExpanded = useCallback(() => {
            setExpanded((prev) => {
                if (prev) {
                    contentHeight.value = withTiming(0, {
                        duration: 200,
                        easing: Easing.inOut(Easing.ease),
                    });
                } else {
                    contentHeight.value = withTiming(110, {
                        duration: 200,
                        easing: Easing.inOut(Easing.ease),
                    });
                }
                return !prev;
            });
        }, []);

        const handleViewAll = useCallback(() => {
            if (viewAll) {
                viewAll();
            }
        }, [viewAll]);

        const firstRowItemsComponent = useMemo(
            () =>
                firstRowItems.map((item, index) => (
                    <View key={`visible-${index}`} style={styles.gridItem}>
                        <CardComponent item={item} />
                    </View>
                )),
            [firstRowItems, CardComponent]
        );

        const remainingItemsComponent = useMemo(
            () =>
                remainingItems.map((item, index) => (
                    <View key={`hidden-${index}`} style={styles.gridItem}>
                        <CardComponent item={item} />
                    </View>
                )),
            [remainingItems, CardComponent]
        );

        const animatedStyle = useAnimatedStyle(() => ({
            height: contentHeight.value,
            overflow: "hidden",
        }));

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

                {/* First row */}
                <View style={styles.gridContainer}>
                    {firstRowItemsComponent}

                    {/* Show More button */}
                    <View style={styles.gridItem}>
                        <ShowMoreCard
                            expanded={expanded}
                            toggleExpanded={toggleExpanded}
                        />
                    </View>
                </View>

                {/* Hidden content */}
                <Animated.View style={[animatedStyle]}>
                    <View style={styles.gridContainer}>
                        {remainingItemsComponent}
                    </View>
                </Animated.View>
            </View>
        );
    }
);

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
        width: "25%",
        marginBottom: 15,
        alignItems: "center",
    },
});

export default QuickLinks;
