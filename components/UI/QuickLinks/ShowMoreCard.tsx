import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import React from "react";
import FastImage from "react-native-fast-image";

type Props = {
    expanded: boolean;
    toggleExpanded: () => void;
    itemsPerRow?: number;
};

const { width } = Dimensions.get("screen");
const DIMENSION_RATIO = 0.14; // Match CategoryCard's ratio
const NUM_CARDS_ON_SCREEN = 5; // Match CategoryCard's card count

const ShowMoreCard = ({ expanded, toggleExpanded, itemsPerRow = 4 }: Props) => {
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
                return 12; // Smaller font for 4+ cards
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
        iconContainer: {
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
            width: Math.min(width * DIMENSION_RATIO * 1.2, 100), // Slightly less overflow and cap width
            paddingHorizontal: 2,
            flexWrap: "wrap",
            paddingTop: 3,
        },
    });
    return (
        <View style={dynamicStyles.card}>
            <TouchableOpacity
                onPress={toggleExpanded}
                style={{ alignItems: "center" }}
                activeOpacity={0.7}
            >
                <View style={dynamicStyles.iconContainer}>
                    <FastImage
                        source={require("@/assets/images/icons/menu.png")}
                        style={styles.image}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={dynamicStyles.title}>
                        {expanded ? "Less" : "More"}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ShowMoreCard;

const styles = StyleSheet.create({
    image: {
        width: "60%",
        height: "60%",
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible", // Allow text to overflow
    },
});
