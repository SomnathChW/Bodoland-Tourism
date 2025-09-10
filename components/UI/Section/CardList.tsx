import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import React from "react";

type CardListProps = {
    itemList: any[];
    CardComponent: React.ElementType;
    horizontal?: boolean;
};

const CardList = React.memo(
    ({ itemList, CardComponent, horizontal = true }: CardListProps) => {
        return (
            <View style={styles.flatList}>
                <FlashList
                    data={itemList}
                    renderItem={({ item, index }) => (
                        <View
                            style={
                                index === 0
                                    ? styles.firstCardContainer
                                    : undefined
                            }
                        >
                            <CardComponent item={item} />
                        </View>
                    )}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={false}
                    estimatedItemSize={horizontal ? 300 : 100}
                />
            </View>
        );
    }
);

export default CardList;

const styles = StyleSheet.create({
    flatList: {},
    firstCardContainer: {
        paddingLeft: 8,
    },
});
