import { StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";

type CardListProps = {
    itemList: any[]; // Adjust the type as needed
    CardComponent: React.ElementType; // The card component to be rendered
};

const CardList = ({ itemList, CardComponent }: CardListProps) => {
    const scrollX = useSharedValue(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    return (
        <View>
            <Animated.FlatList
                data={itemList}
                renderItem={({ item, index }) => (
                    <CardComponent
                        item={item}
                        index={index}
                        scrollX={scrollX}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={onScrollHandler}
                removeClippedSubviews={false}
                style={styles.flatList}
            />
        </View>
    );
};

export default CardList;

const styles = StyleSheet.create({
    flatList: {},
});
