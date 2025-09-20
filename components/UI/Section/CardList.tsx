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
    cardType?: "horizontal" | "vertical"; // Optional explicit card type
};

const CardList = React.memo(
    ({
        itemList,
        CardComponent,
        horizontal = true,
        isLoading = false,
        loadingCardCount = 3,
        cardType,
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

        // Determine which loader component to use based on card component type
        // Priority: explicit cardType prop > component name analysis
        let isHorizontalCard: boolean;

        if (cardType) {
            isHorizontalCard = cardType === "horizontal";
        } else {
            // Fallback to component name analysis
            const componentName =
                (CardComponent as any).displayName ||
                (CardComponent as any).name ||
                "";
            isHorizontalCard =
                componentName.includes("Horizontal") ||
                componentName === "CardHorizontal";
        }

        const LoaderComponent = isHorizontalCard
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
