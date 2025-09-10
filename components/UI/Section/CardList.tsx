import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import CardHorizontalLoader from "./CardHorizontalLoader";
import CardVerticalLoader from "./CardVerticalLoader";

type CardListProps = {
    itemList: any[];
    CardComponent: React.ElementType;
    horizontal?: boolean;
    isLoading?: boolean;
    loadingCardCount?: number;
};

const CardList = React.memo(
    ({
        itemList,
        CardComponent,
        horizontal = true,
        isLoading = false,
        loadingCardCount = 3,
    }: CardListProps) => {
        // Create loading skeleton data if loading
        const loadingData = Array.from(
            { length: loadingCardCount },
            (_, index) => ({
                isLoading: true,
                id: `loading-${index}`,
            })
        );

        // Use loading data if loading, otherwise use actual data
        const displayData = isLoading ? loadingData : itemList;

        // Determine which loader component to use
        const LoaderComponent =
            (CardComponent as any).name === "CardHorizontal"
                ? CardHorizontalLoader
                : CardVerticalLoader;

        return (
            <View style={styles.flatList}>
                <FlashList
                    data={displayData}
                    renderItem={({ item, index }) => (
                        <View
                            style={
                                index === 0
                                    ? styles.firstCardContainer
                                    : undefined
                            }
                        >
                            {isLoading ? (
                                <LoaderComponent />
                            ) : (
                                <CardComponent item={item} />
                            )}
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
