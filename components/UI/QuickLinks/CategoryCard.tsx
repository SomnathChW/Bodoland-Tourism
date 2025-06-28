import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import FastImage from "react-native-fast-image";

type Props = {
    item: any;
};

const { width } = Dimensions.get("screen");
const DIMENSION_RATIO = 0.17;
const NUM_CARDS_ON_SCREEN = 4.8;

const CategoryCard = ({ item }: Props) => {
    const router = useRouter();

    return (
        <View style={styles.card}>
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: item.route,
                    })
                }
                style={{ alignItems: "center" }}
            >
                <View style={styles.imageContainer}>
                    <FastImage source={item.image} style={styles.image} />
                </View>
                <Text style={styles.title}>{item.title}</Text>
            </Pressable>
        </View>
    );
};

export default CategoryCard;

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: Math.ceil(
            (width * (1 - DIMENSION_RATIO * NUM_CARDS_ON_SCREEN)) /
                (NUM_CARDS_ON_SCREEN * 2)
        ),
    },
    imageContainer: {
        width: Math.ceil(width * DIMENSION_RATIO),
        height: Math.ceil(width * DIMENSION_RATIO),
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "rgba(52, 52, 52, 0.35)",
    },
    image: {
        width: "70%",
        height: "70%",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
        color: "#646f7e",
    },
});
