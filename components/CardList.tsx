import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import React from "react";

type CardListProps = {
    itemList: any[];  
    CardComponent: React.ElementType; 
    horizontal?: boolean; 
};

const CardList = ({
    itemList,
    CardComponent,
    horizontal = true,
}: CardListProps) => {
    return (
        <View>
            <FlashList
                data={itemList}
                renderItem={({ item }) => <CardComponent item={item} />}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews={false}
                style={styles.flatList}
                estimatedItemSize={15}
            />
        </View>
    );
};

export default CardList;

const styles = StyleSheet.create({
    flatList: {},
});
