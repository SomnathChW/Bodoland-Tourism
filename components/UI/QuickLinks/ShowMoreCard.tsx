import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

type Props = {
    expanded: boolean;
    toggleExpanded: () => void;
};

const { width } = Dimensions.get("screen");
const DIMENSION_RATIO = 0.17;
const NUM_CARDS_ON_SCREEN = 4.8;

const ShowMoreCard = ({ expanded, toggleExpanded }: Props) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={toggleExpanded}
                style={{ alignItems: "center" }}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <FastImage
                        source={require("@/assets/images/icons/menu.png")}
                        style={styles.image}
                    />
                </View>
                <Text style={styles.title}>{expanded ? "Less" : "More"}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ShowMoreCard;

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: Math.ceil(
            (width * (1 - DIMENSION_RATIO * NUM_CARDS_ON_SCREEN)) /
                (NUM_CARDS_ON_SCREEN * 2)
        ),
    },
    iconContainer: {
        width: Math.ceil(width * DIMENSION_RATIO),
        height: Math.ceil(width * DIMENSION_RATIO),
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "rgba(52, 52, 52, 0.35)",
    },
    image: {
        width: "50%",
        height: "50%",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
        color: "#646f7e",
    },
});
