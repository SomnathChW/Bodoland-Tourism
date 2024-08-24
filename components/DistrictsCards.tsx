import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { SharedValue } from "react-native-reanimated";
import { DistrictTypes } from "@/data/district_data";

type Props = {
    item: DistrictTypes;
    index: number;
    scrollX: SharedValue<number>;
};

const { width, height } = Dimensions.get("screen");

const DistrictCards = ({ item, index, scrollX }: Props) => {
    return (
        <View style={[styles.card]}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
        </View>
    );
};

export default DistrictCards;

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        borderRadius: 10,
    },
    image: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: 20,
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        color: "#646f7e",
        marginTop: 5,
    },
});
