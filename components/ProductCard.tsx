import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Pressable,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

type Props = {
    item: {
        identifier: string;
        title: string;
        image: any;
        discount_percentage?: string;
        original_price?: string;
        price: string;
    };
    index: number;
};

const { width, height } = Dimensions.get("screen");
const PADDING = 15;
const GAP = 15;
const NUM_CARDS_ON_SCREEN = 2;
const CARD_WIDTH =
    (width - PADDING * 2 - GAP * (NUM_CARDS_ON_SCREEN - 1)) /
    NUM_CARDS_ON_SCREEN;
const CARD_HEIGHT = height * 0.25;

const ProductCard = ({ item, index }: Props) => {
    const router = useRouter();

    const [isBookmarked, setIsBookmarked] = React.useState(false);

    return (
        <View style={index % 2 === 0 ? styles.cardLeft : styles.cardRight}>
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: "/details",
                        params: { identifier: item.identifier },
                    })
                }
            >
                <FastImage source={{ uri: item.image }} style={styles.image} />
                {item.title && (
                    <View style={styles.infoView}>
                        <View style={styles.textView}>
                            <Text style={styles.title} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <View style={styles.offerView}>
                                    <AntDesign
                                        name="arrowdown"
                                        size={10}
                                        color="lime"
                                        style={{
                                            marginRight: 2,
                                        }}
                                    />
                                    <Text style={styles.offerPercentageText}>
                                        {item.discount_percentage + "%"}
                                    </Text>
                                </View>
                                <Text style={styles.price}>
                                    {"₹ " + item.price}
                                </Text>
                                <Text style={styles.discount}>
                                    {"₹ " + item.original_price}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                <Pressable
                    style={styles.tagCard}
                    onPress={() => setIsBookmarked(!isBookmarked)}
                >
                    <FontAwesome
                        name={isBookmarked ? "heart" : "heart-o"}
                        size={20}
                        color={
                            isBookmarked
                                ? "rgba(255, 0, 0, 0.80)"
                                : "rgba(0, 0, 0, 0.40)"
                        }
                    />
                </Pressable>
            </Pressable>
        </View>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    cardLeft: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "rgba(52, 52, 52, 0.35)",
        borderRadius: 10,
        shadowOffset: { width: 10, height: 0 },
        marginVertical: 10,
        marginLeft: PADDING,
        marginRight: GAP / 2,
        overflow: "hidden",
    },
    cardRight: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "rgba(52, 52, 52, 0.35)",
        borderRadius: 10,
        shadowOffset: { width: 10, height: 0 },
        marginVertical: 10,
        marginLeft: GAP / 2,
        marginRight: PADDING,
        overflow: "hidden",
    },
    tagCard: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        height: CARD_HEIGHT * 0.15,
        width: CARD_HEIGHT * 0.15,
        top: CARD_HEIGHT * 0.05,
        right: CARD_WIDTH * 0.05,
        alignSelf: "flex-start",
        borderRadius: 10,
        backgroundColor: "rgba(52, 52, 52, 0.24)",
    },
    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT * 0.75,
    },
    infoView: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT * 0.25,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    textView: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        marginHorizontal: 5,
        marginBottom: 4,
        textAlignVertical: "center",
    },
    price: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "white",
        marginHorizontal: 4,
        textAlignVertical: "bottom",
        lineHeight: 12,
    },
    discount: {
        fontFamily: "SfProMedium",
        fontSize: 10,
        color: "#646f7e",
        marginLeft: 4,
        textDecorationLine: "line-through",
        textAlignVertical: "bottom",
        lineHeight: 12,
    },
    offerView: {
        // backgroundColor: "rgba(84, 224, 126, 0.4)",
        paddingVertical: 1,
        paddingHorizontal: 3,
        borderRadius: 3,
        marginLeft: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    offerPercentageText: {
        fontFamily: "SfProMedium",
        fontSize: 10,
        color: "lime",
        textAlign: "center",
        textAlignVertical: "bottom",
        lineHeight: 12,
    },
});
