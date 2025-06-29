import React, { useState, useMemo, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    LayoutChangeEvent,
} from "react-native";
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

// CollapsableContainer component (same concept as the first code)
const CollapsableContainer = ({
    children,
    expanded,
}: {
    children: React.ReactNode;
    expanded: boolean;
}) => {
    const [height, setHeight] = useState(0);
    const animatedHeight = useSharedValue(0);

    const onLayout = (event: LayoutChangeEvent) => {
        const onLayoutHeight = event.nativeEvent.layout.height;

        if (onLayoutHeight > 0 && height !== onLayoutHeight) {
            setHeight(onLayoutHeight);
        }
    };

    const collapsableStyle = useAnimatedStyle(() => {
        animatedHeight.value = expanded
            ? withTiming(height, {
                  duration: 200,
                  easing: Easing.inOut(Easing.ease),
              })
            : withTiming(0, {
                  duration: 200,
                  easing: Easing.inOut(Easing.ease),
              });

        return {
            height: animatedHeight.value,
        };
    }, [expanded, height]);

    return (
        <Animated.View style={[collapsableStyle, { overflow: "hidden" }]}>
            <View
                style={{ position: "absolute", width: "100%" }}
                onLayout={onLayout}
            >
                {children}
            </View>
        </Animated.View>
    );
};

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
        const visibleItemsCount = itemsPerRow - 1;

        const { firstRowItems, remainingItems } = useMemo(() => {
            const firstItems = data.slice(0, visibleItemsCount);
            const remainingItems = data.slice(visibleItemsCount);
            return { firstRowItems: firstItems, remainingItems };
        }, [data, visibleItemsCount]);

        const dynamicStyles = StyleSheet.create({
            gridItem: {
                flex: 1,
                maxWidth: `${100 / itemsPerRow}%`,
                marginBottom: 15,
                alignItems: "center",
            },
            firstRowContainer: {
                flexDirection: "row",
                flexWrap: "nowrap", // Prevent wrapping for the first row
                paddingHorizontal: 20,
                justifyContent: "space-between",
            },
            remainingRowsContainer: {
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 20,
            },
        });

        const toggleExpanded = useCallback(() => {
            setExpanded((prev) => !prev);
        }, []);

        const handleViewAll = useCallback(() => {
            if (viewAll) {
                viewAll();
            }
        }, [viewAll]);

        const firstRowItemsComponent = useMemo(
            () =>
                firstRowItems.map((item, index) => (
                    <View
                        key={`visible-${index}`}
                        style={dynamicStyles.gridItem}
                    >
                        <CardComponent item={item} itemsPerRow={itemsPerRow} />
                    </View>
                )),
            [firstRowItems, CardComponent, dynamicStyles.gridItem, itemsPerRow]
        );

        const remainingItemsComponent = useMemo(
            () =>
                remainingItems.map((item, index) => (
                    <View
                        key={`hidden-${index}`}
                        style={dynamicStyles.gridItem}
                    >
                        <CardComponent item={item} itemsPerRow={itemsPerRow} />
                    </View>
                )),
            [remainingItems, CardComponent, dynamicStyles.gridItem, itemsPerRow]
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

                {/* First row */}
                <View style={dynamicStyles.firstRowContainer}>
                    {firstRowItemsComponent}

                    {/* Show More button */}
                    <View style={dynamicStyles.gridItem}>
                        <ShowMoreCard
                            expanded={expanded}
                            toggleExpanded={toggleExpanded}
                            itemsPerRow={itemsPerRow}
                        />
                    </View>
                </View>

                {/* Hidden content with CollapsableContainer */}
                <CollapsableContainer expanded={expanded}>
                    <View style={dynamicStyles.remainingRowsContainer}>
                        {remainingItemsComponent}
                    </View>
                </CollapsableContainer>
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
});

export default QuickLinks;
