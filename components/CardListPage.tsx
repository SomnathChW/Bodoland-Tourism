import { View, FlatList } from "react-native";
import React from "react";

import CardFullHorizontal from "@/components/CardFullHorizontal";

type CardListProps = {
    itemList: any[]; // Adjust the type as needed
};

const CardListPage = ({ itemList }: CardListProps) => {
    return (
        <View>
            <FlatList
                data={itemList}
                renderItem={({ item }) => <CardFullHorizontal item={item} />}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                ListFooterComponent={<View style={{ height: 75 }} />}
            />
        </View>
    );
};

export default CardListPage;
