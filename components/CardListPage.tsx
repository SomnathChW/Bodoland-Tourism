import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import React from "react";

import CardFullHorizontal from "@/components/CardFullHorizontal";

type CardListProps = {
    itemList: any[]; // Adjust the type as needed
};

const CardListPage = ({ itemList }: CardListProps) => {
    return (
        <View>
            <FlashList
                data={itemList}
                renderItem={({ item }) => <CardFullHorizontal item={item} />}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                ListFooterComponent={<View style={{ height: 75 }} />}
                estimatedItemSize={100}
            />
        </View>
    );
};

export default CardListPage;
