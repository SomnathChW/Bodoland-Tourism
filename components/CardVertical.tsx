import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Pressable,
} from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";

type Props = {
    item: any;
};

const { width, height } = Dimensions.get("screen");
const WIDTH_RATIO = 0.32;
const HEIGHT_RATIO = 0.2;
const NUM_CARDS_ON_SCREEN = 2.8;

const CardVertical = ({ item }: Props) => {
    const router = useRouter();
    return (
        <Animated.View style={[styles.card]}>
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: "/details",
                        params: { identifier: item.identifier },
                    })
                }
            >
                <Image source={item.image} style={styles.image} />
                <View style={styles.textView}>
                    <View style={styles.textView}>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default CardVertical;

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        justifyContent: "center",
        width: Math.ceil(width * WIDTH_RATIO),
        marginHorizontal: Math.ceil(
            (width * (1 - WIDTH_RATIO * NUM_CARDS_ON_SCREEN)) /
                (NUM_CARDS_ON_SCREEN * 2)
        ),
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        shadowOffset: { width: 10, height: 0 },
    },
    image: {
        width: Math.ceil(width * WIDTH_RATIO),
        height: Math.ceil(height * HEIGHT_RATIO),
        borderRadius: 10,
    },
    textView: {
        position: "absolute",
        bottom: 0,
        width: Math.ceil(width * WIDTH_RATIO),
        height: Math.ceil(height * HEIGHT_RATIO * 0.2),
        padding: 7,
        justifyContent: "flex-end",
        borderBottomRightRadius: 9,
        borderBottomLeftRadius: 9,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 11,
        fontWeight: "bold",
        color: "white",
        marginHorizontal: 5,
    },
    description: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "white",
        marginHorizontal: 5,
    },
});
