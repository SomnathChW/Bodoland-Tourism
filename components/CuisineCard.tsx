import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import FastImageWLoader from "@/components/FastImageWLoader";

export type CuisineProps = {
    item: {
        identifier: string;
        name: string;
        image: any;
        short_description: string;
        [key: string]: any; // Allow additional properties
    };
    index: number;
    width: number;
    height: number;
};

// Calculate base dimensions
const PADDING = 15;
const GAP = 15;
const NUM_CARDS_ON_SCREEN = 2;

const CuisineCard = React.memo(
    ({ item, index, width, height }: CuisineProps) => {
        const router = useRouter();

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

                            <Text style={styles.desc} numberOfLines={1}>
                                {item.short_description}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    }
);

export default CuisineCard;

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
    desc: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "#646f7e",
        flex: 1,
        marginBottom: 2,
        paddingRight: 10,
    },
});
