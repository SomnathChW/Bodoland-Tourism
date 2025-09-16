import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import FastImage from "react-native-fast-image";

type Props = {
    item: any;
    itemsPerRow?: number;
};

const CategoryCard = React.memo(({ item, itemsPerRow = 4 }: Props) => {
    const router = useRouter();
    const { width } = Dimensions.get("screen");

    // Dynamic sizing based on itemsPerRow
    const getDimensionRatio = (items: number) => {
        switch (items) {
            case 3:
                return 0.22;
            case 4:
                return 0.17;
            case 5:
                return 0.14;
            case 6:
                return 0.12;
            default:
                return 0.17;
        }
    };

    // Dynamic font size based on itemsPerRow
    const getFontSize = (items: number) => {
        switch (items) {
            case 3:
                return 16; // Largest font for 3 cards
            case 4:
                return 14;
            default:
                return 12;
        }
    };

    const DIMENSION_RATIO = getDimensionRatio(itemsPerRow);
    const NUM_CARDS_ON_SCREEN = itemsPerRow;
    const FONT_SIZE = getFontSize(itemsPerRow);

    const dynamicStyles = StyleSheet.create({
        card: {
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: Math.ceil(
                (width * (1 - DIMENSION_RATIO * NUM_CARDS_ON_SCREEN)) /
                    (NUM_CARDS_ON_SCREEN * 2)
            ),
        },
        imageContainer: {
            width: Math.min(width * DIMENSION_RATIO, 80), // Cap maximum size
            height: Math.min(width * DIMENSION_RATIO, 80),
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "rgba(52, 52, 52, 0.35)",
        },
        title: {
            fontFamily: "SfProMedium",
            fontSize: FONT_SIZE,
            fontWeight: "bold",
            color: "#646f7e",
            textAlign: "center",
            width: Math.min(width * DIMENSION_RATIO * 1.3, 100), // Slightly less overflow and cap width
            paddingHorizontal: 2,
            paddingTop: 3,
            flexWrap: "wrap",
        },
    });

    return (
        <View style={dynamicStyles.card}>
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: item.route,
                    })
                }
                style={{ alignItems: "center" }}
            >
                <View style={dynamicStyles.imageContainer}>
                    <FastImage source={item.image} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={dynamicStyles.title}>{item.title}</Text>
                </View>
            </Pressable>
        </View>
    );
});

export default CategoryCard;

const styles = StyleSheet.create({
    image: {
        width: "70%",
        height: "70%",
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible", // Allow text to overflow
    },
});
