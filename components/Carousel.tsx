import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import React from "react";
import { CarouselTypes } from "@/data/slider_data";
import CarouselCard from "./CarouselCard";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";

type Props = {
    itemList: CarouselTypes[];
};

const { width } = Dimensions.get("screen");

const Carousel = ({ itemList }: Props) => {
    const scrollX = useSharedValue(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    itemList.sort((a, b) => {
        if (a.tag && !b.tag) {
            return -1;
        }
        if (!a.tag && b.tag) {
            return 1;
        }
        return 0;
    });

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={itemList}
                renderItem={({ item, index }) => (
                    <CarouselCard item={item} index={index} scrollX={scrollX} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScrollHandler}
                removeClippedSubviews={false}
                initialScrollIndex={1}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default Carousel;
