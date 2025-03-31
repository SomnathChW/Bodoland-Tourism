import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Pressable,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Entypo, FontAwesome } from "@expo/vector-icons";

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
const CARD_HEIGHT = height * 0.3;

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
                <Image source={{ uri: item.image }} style={styles.image} />
                {item.title && (
                    <View style={styles.infoView}>
                        <View style={styles.textView}>
                            <Text style={styles.title} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <View style={styles.discountView}>
                                <View style={styles.offerView}>
                                    <Text style={styles.offerPercentageText}>
                                        {item.discount_percentage + "% off"}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={styles.price}>
                                    {"₹ " + item.price}
                                </Text>
                                <Text style={styles.discount}>
                                    {"₹ " + item.original_price}
                                </Text>
                            </View>
                        </View>
                        <Pressable onPress={() => {}} style={styles.icon}>
                            <Entypo
                                name="shopping-cart"
                                size={20}
                                color="#646f7e"
                            />
                        </Pressable>
                    </View>
                )}
                <Pressable
                    style={styles.tagCard}
                    onPress={() => setIsBookmarked(!isBookmarked)}
                >
                    <FontAwesome
                        name="bookmark"
                        size={15}
                        color={
                            isBookmarked
                                ? "rgb(255, 255, 255)"
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
        height: CARD_HEIGHT * 0.14,
        width: CARD_HEIGHT * 0.12,
        top: CARD_HEIGHT * 0.05,
        right: CARD_WIDTH * 0.05,
        alignSelf: "flex-start",
        padding: 2,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "rgba(52, 52, 52, 0.5)",
    },
    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT * 0.65,
    },
    infoView: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT * 0.35,
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
        marginBottom: 5,
    },
    price: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "white",
        marginHorizontal: 4,
        fontWeight: "bold",
    },
    discountView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignContent: "center",
        marginBottom: 5,
    },
    discount: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "#646f7e",
        marginLeft: 4,
        textDecorationLine: "line-through",
    },
    offerView: {
        backgroundColor: "rgba(84, 224, 126, 0.4)",
        paddingVertical: 1,
        paddingHorizontal: 3,
        borderRadius: 3,
        marginLeft: 4,
    },
    offerPercentageText: {
        fontFamily: "SfProMedium",
        fontSize: 10,
        color: "white",
        textAlign: "center",
    },
    icon: {
        marginLeft: 10,
        marginRight: 4,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        padding: 10,
        borderRadius: 5,
    },
});
