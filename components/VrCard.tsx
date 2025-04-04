import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

type Props = {
    item: {
        identifier: string;
        image: any;
        title?: string;
        location?: string;
        geohash?: string;
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

const VrCard = ({ item, index }: Props) => {
    const router = useRouter();
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
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Entypo
                                    name="location-pin"
                                    size={12}
                                    color="#646f7e"
                                    style={[styles.icon, { marginLeft: 2 }]}
                                />
                                <Text style={styles.location} numberOfLines={1}>
                                    {item.location}
                                </Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons
                            name="google-cardboard"
                            size={30}
                            color="#646f7e"
                            style={styles.icon}
                        />
                    </View>
                )}
                {item.geohash && (
                    <View style={styles.distanceCard}>
                        <Text
                            style={{
                                fontFamily: "SfProMedium",
                                fontSize: 10,
                                color: "white",
                                textAlign: "center",
                            }}
                        >
                            {item.geohash}
                        </Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
};

export default VrCard;

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
    distanceCard: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        height: CARD_HEIGHT * 0.12,
        top: CARD_HEIGHT * 0.05,
        left: CARD_WIDTH * 0.05,
        alignSelf: "flex-start",
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "rgba(52, 52, 52, 0.5)",
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
    },
    location: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "#646f7e",
        marginHorizontal: 2,
    },
    icon: {
        marginLeft: 10,
    },
});
