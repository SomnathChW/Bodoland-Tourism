import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";
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
    const flatListRef = useRef<FlatList>(null);
    const scrollPosition = useSharedValue(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const sortedItemList = [...itemList].sort((a, b) => {
        if (a.tag && !b.tag) return -1;
        if (!a.tag && b.tag) return 1;
        return 0;
    });

    const autoScroll = () => {
        if (flatListRef.current) {
            const nextIndex =
                (Math.floor(scrollPosition.value) + 1) % sortedItemList.length;
            flatListRef.current.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            scrollPosition.value = nextIndex;
        }
    };

    useEffect(() => {
        const intervalId = setInterval(autoScroll, 3000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                data={sortedItemList}
                renderItem={({ item, index }) => (
                    <CarouselCard item={item} index={index} scrollX={scrollX} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScrollHandler}
                removeClippedSubviews={false}
                initialScrollIndex={0}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                onMomentumScrollEnd={(event) => {
                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                    const currentIndex = Math.round(contentOffsetX / width);
                    scrollPosition.value = currentIndex;
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 10 },
});

export default Carousel;
