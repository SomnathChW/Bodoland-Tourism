import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import FastImage from "@d11/react-native-fast-image";

type Props = {
    item: {
        identifier: string;
        image: any;
        name?: string;
        tour_resource?: string;
    };
};

const { width, height } = Dimensions.get("screen");
const WIDTH_RATIO = 0.445;
const HEIGHT_RATIO = 0.144;
const NUM_CARDS_ON_SCREEN = 2.11;

const CARD_WIDTH = Math.ceil(width * WIDTH_RATIO);
const CARD_HEIGHT = Math.ceil(height * HEIGHT_RATIO);
const TEXT_HEIGHT = Math.ceil(CARD_HEIGHT * 0.25);

const CardHorizontal = React.memo(({ item }: Props) => {
    const router = useRouter();
    return (
        <View style={styles.card}>
            <Pressable
                onPress={() => {
                    if (
                        (item.identifier as string)
                            .split(/[-_]/)[0]
                            .toLowerCase() === "vt"
                    ) {
                        if (item?.tour_resource) {
                            router.navigate({
                                pathname: "/vr_view_fullscreen",
                                params: { tour_resource: item.tour_resource },
                            });
                        }
                    } else {
                        router.push({
                            pathname: "/details",
                            params: { identifier: item.identifier },
                        });
                    }
                }}
                style={styles.pressable}
            >
                <FastImage
                    source={
                        typeof item.image === "string"
                            ? { uri: item.image }
                            : item.image
                    }
                    style={styles.image}
                />
                {item.name && (
                    <View style={styles.textView}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
});

export default CardHorizontal;

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        marginHorizontal: Math.ceil(
            (width * (1 - WIDTH_RATIO * NUM_CARDS_ON_SCREEN)) /
                (NUM_CARDS_ON_SCREEN * 2)
        ),
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
    },
    pressable: {
        borderRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 10,
    },
    textView: {
        position: "absolute",
        bottom: 0,
        width: CARD_WIDTH,
        height: TEXT_HEIGHT,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        paddingHorizontal: 8,
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "600",
        color: "#ffffff",
    },
});
