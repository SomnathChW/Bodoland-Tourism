import { Text, View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import CuisineCard from "@/components/UI/ItemCards/CuisineCard";
import { cuisineData } from "@/data/cuisine_data";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/UI/PageHeader/Header";

const { width, height } = Dimensions.get("screen");

const Transport = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                headingText="Cuisines"
                subHeadingText="Explore the rich culinary heritage"
            />
            <FlashList
                data={cuisineData}
                renderItem={({ item, index }) => (
                    <CuisineCard
                        item={item}
                        index={index}
                        width={width}
                        height={height}
                    />
                )}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyExtractor={(item) => item.identifier}
                contentContainerStyle={{}}
            />
        </View>
    );
};

export default Transport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    content: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    buttons: {
        color: "#fff",
    },
    headingText: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        color: "#fff",
    },
    mainSubHeaddingText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#646f7e",
    },
});
