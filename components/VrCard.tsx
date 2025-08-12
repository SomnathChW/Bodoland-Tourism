import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

type Props = {
    item: {
        identifier: string;
        image: any;
        title?: string;
        location?: string;
        geohash?: string | null;
    };
    index: number;
};

const { width, height } = Dimensions.get("screen");
// Calculate base dimensions
const PADDING = 15;
const GAP = 15;
const NUM_CARDS_ON_SCREEN = 2;
const CARD_WIDTH =
    (width - PADDING * 2 - GAP * (NUM_CARDS_ON_SCREEN - 1)) /
    NUM_CARDS_ON_SCREEN;

// Use a minimum image height that ensures it's always prominent
const MIN_IMAGE_HEIGHT = height * 0.18; // Similar to your StaysCard component

const VrCard = ({ item, index }: Props) => {
    const router = useRouter();
    const tourUrl =
        "https://as2.ftcdn.net/jpg/01/83/48/17/1000_F_183481794_XVV7tm8VdFmlmdIcK0TI94hc9mDqDSnb.jpg";

    return (
        <View
            style={{
                width: CARD_WIDTH,
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
                        pathname: "/vr_view_fullscreen",
                        params: { tourUrl: tourUrl },
                    })
                }
            >
                {/* Image with fixed minimum height but can grow */}
                <FastImage
                    source={{ uri: item.image }}
                    style={{
                        width: CARD_WIDTH,
                        height: MIN_IMAGE_HEIGHT,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />

                {/* Info section that grows based on content */}
                {item.title && (
                    <View style={styles.infoView}>
                        <View style={styles.textView}>
                            <Text
                                style={styles.title}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item.title}
                            </Text>
                            <View style={styles.locationRow}>
                                <Entypo
                                    name="location-pin"
                                    size={12}
                                    color="#646f7e"
                                    style={{ marginRight: 2 }}
                                />
                                <Text
                                    style={styles.location}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.location}
                                </Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons
                            name="google-cardboard"
                            size={30}
                            color="#646f7e"
                        />
                    </View>
                )}

                {/* Geohash badge */}
                {item.geohash && (
                    <View style={styles.distanceCard}>
                        <Text style={styles.distanceText}>{item.geohash}</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
};

export default VrCard;

const styles = StyleSheet.create({
    infoView: {
        width: CARD_WIDTH,
        minHeight: 60, // Minimum height for the info section
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    textView: {
        flex: 1,
        justifyContent: "center",
        marginRight: 10, // Space for the icon
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
    },
    location: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "#646f7e",
        flex: 1, // Allow text to shrink when needed
    },
    distanceCard: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        paddingHorizontal: 10,
        top: 15,
        left: 15,
        borderRadius: 10,
        backgroundColor: "rgba(52, 52, 52, 0.5)",
    },
    distanceText: {
        fontFamily: "SfProMedium",
        fontSize: 10,
        color: "white",
        textAlign: "center",
    },
});
