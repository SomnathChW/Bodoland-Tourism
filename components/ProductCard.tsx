import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import FastImageWLoader from "@/components/FastImageWLoader";

type Props = {
    item: {
        identifier: string;
        name: string;
        image: any;
        discount_percentage?: string;
        original_price?: string;
        price: string;
        rating?: number;
    };
    index: number;
    width: number;
    height: number;
};

const PADDING = 15;
const GAP = 15;
const NUM_CARDS_ON_SCREEN = 2;

const ProductCard = React.memo(({ item, index, width, height }: Props) => {
    const router = useRouter();

    const CARD_WIDTH =
        (width - PADDING * 2 - GAP * (NUM_CARDS_ON_SCREEN - 1)) /
        NUM_CARDS_ON_SCREEN;

    const MIN_CARD_HEIGHT = height * 0.25;
    const MIN_IMAGE_HEIGHT = MIN_CARD_HEIGHT * 0.75;

    const renderSimpleRating = () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome
                name="star"
                size={12}
                color="#FFD700"
                style={{ marginRight: 4 }}
            />
            <Text style={styles.rating}>
                {item.rating ? item.rating.toFixed(1) : "N/A"}
            </Text>
        </View>
    );

    return (
        <View
            style={{
                width: CARD_WIDTH,
                minHeight: MIN_CARD_HEIGHT,
                backgroundColor: "rgba(52, 52, 52, 0.35)",
                borderRadius: 10,
                shadowOffset: { width: 10, height: 0 },
                marginVertical: 10,
                marginLeft: index % 2 === 0 ? PADDING : GAP / 2,
                marginRight: index % 2 === 0 ? GAP / 2 : PADDING,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: "/details",
                        params: { identifier: item.identifier },
                    })
                }
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <FastImageWLoader
                    source={{ uri: item.image }}
                    style={{
                        width: CARD_WIDTH,
                        minHeight: MIN_IMAGE_HEIGHT,
                        flexGrow: 3,
                        flexShrink: 0,
                        flexBasis: MIN_IMAGE_HEIGHT,
                    }}
                />

                {item.name && (
                    <View
                        style={{
                            width: CARD_WIDTH,
                            flexGrow: 1,
                            flexShrink: 0,
                            flexBasis: "auto",
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                        }}
                    >
                        <View style={styles.textView}>
                            <Text style={styles.title} numberOfLines={1}>
                                {item.name}
                            </Text>

                            {item.rating ? (
                                <View style={styles.ratingRow}>
                                    {renderSimpleRating()}
                                </View>
                            ) : (
                                <View style={styles.ratingRow}>
                                    <FontAwesome
                                        name="star"
                                        size={12}
                                        color="gray"
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text
                                        style={[
                                            styles.rating,
                                            { color: "gray" },
                                        ]}
                                    >
                                        {"No Ratings"}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.priceContainer}>
                                {item.discount_percentage && (
                                    <View style={styles.offerView}>
                                        <AntDesign
                                            name="arrow-down"
                                            size={10}
                                            color="lime"
                                            style={{ marginRight: 2 }}
                                        />
                                        <Text
                                            style={styles.offerPercentageText}
                                        >
                                            {item.discount_percentage + "%"}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.priceAlignContainer}>
                                    <Text style={styles.price}>
                                        {"₹ " + item.price}
                                    </Text>
                                    {item.original_price && (
                                        <Text style={styles.discount}>
                                            {"₹ " + item.original_price}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </Pressable>
        </View>
    );
});

export default ProductCard;

const styles = StyleSheet.create({
    textView: {
        flex: 1,
        justifyContent: "space-between",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    priceAlignContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        marginBottom: 2,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2,
    },
    rating: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "#FFD700",
    },
    price: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "white",
        marginHorizontal: 4,
    },
    discount: {
        fontFamily: "SfProMedium",
        fontSize: 10,
        color: "#646f7e",
        marginLeft: 2,
        textDecorationLine: "line-through",
    },
    offerView: {
        paddingVertical: 1,
        paddingHorizontal: 3,
        borderRadius: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    offerPercentageText: {
        fontFamily: "SfProMedium",
        fontSize: 10,
        color: "lime",
        textAlign: "center",
    },
});
