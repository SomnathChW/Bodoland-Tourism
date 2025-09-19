import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import FastImageWLoader from "@/components/FastImageWLoader";

type Props = {
    item: {
        identifier: string;
        name: string;
        image: any;
        location: string;
        price?: string; // Optional price
    };
    index: number;
    width: number;
    height: number;
};

const AttractionsCard = React.memo(({ item, index, width, height }: Props) => {
    const router = useRouter();

    const PADDING = 15;
    const GAP = 15;
    const NUM_CARDS_ON_SCREEN = 2;
    const CARD_WIDTH =
        (width - PADDING * 2 - GAP * (NUM_CARDS_ON_SCREEN - 1)) /
        NUM_CARDS_ON_SCREEN;

    // Set minimum card height to 25% of screen height
    const MIN_CARD_HEIGHT = height * 0.25;
    // Set minimum image height to 75% of minimum card height
    const MIN_IMAGE_HEIGHT = MIN_CARD_HEIGHT * 0.75;

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
            }}
        >
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: "/details",
                        params: { identifier: item.identifier },
                    })
                }
                style={{ flex: 1 }}
            >
                {/* Image section with minimum height */}
                <FastImageWLoader
                    source={{ uri: item.image }}
                    style={{
                        width: CARD_WIDTH,
                        height: MIN_IMAGE_HEIGHT,
                        flex: 1.5, // This makes the image section always 1.5 times larger than info section
                    }}
                />

                {/* Info section with flex: 1 (smaller than image) */}
                <View
                    style={{
                        width: CARD_WIDTH,
                        flex: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                    }}
                >
                    <View style={styles.topSection}>
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.name}
                        </Text>

                        <View style={styles.locationRow}>
                            <Entypo
                                name="location-pin"
                                size={12}
                                color="#646f7e"
                                style={{ marginRight: 2 }}
                            />
                            <Text style={styles.location} numberOfLines={1}>
                                {item.location}
                            </Text>
                        </View>

                        <View style={styles.priceRow}>
                            <FontAwesome
                                name="ticket"
                                size={12}
                                color="#646f7e"
                                style={{ marginRight: 4 }}
                            />
                            <Text
                                style={
                                    !item.price
                                        ? styles.freePrice
                                        : styles.price
                                }
                            >
                                {item.price ? "₹ " + item.price : "Free"}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    );
});

export default AttractionsCard;

const styles = StyleSheet.create({
    topSection: {
        flex: 1,
        justifyContent: "space-between",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        marginBottom: 2,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    location: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "#646f7e",
        flex: 1,
    },
    mapIconContainer: {
        padding: 3,
        marginLeft: 5,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
        marginTop: 2, // Added top margin as requested
    },
    price: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "white",
    },
    freePrice: {
        // New style for free price in green
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "#4CD964", // Green color
    },
});
