import { StyleSheet, View, FlatList } from "react-native";
import React from "react";

type CardListProps = {
    itemList: any[]; // Adjust the type as needed
    CardComponent: React.ElementType; // The card component to be rendered
};

const CardList = ({ itemList, CardComponent }: CardListProps) => {
    return (
        <View>
            <FlatList
                data={itemList}
                renderItem={({ item }) => <CardComponent item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
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
