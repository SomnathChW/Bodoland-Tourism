import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

type Props = {
    item: {
        identifier: string;
        name: string;
        image: any;
        location: string;
        rating: number;
        price: string;
        original_price?: string;
        discount_percentage?: string;
        amenities?: string[];
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

// Set minimum card height to 25% of screen height
const MIN_CARD_HEIGHT = height * 0.25;
// Set minimum image height to 75% of minimum card height
const MIN_IMAGE_HEIGHT = MIN_CARD_HEIGHT * 0.75;

const StaysCard = ({ item, index }: Props) => {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = React.useState(false);

    // Simplified star rating - just one star with rating value
    const renderSimpleRating = () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome
                name="star"
                size={12}
                color="#FFD700"
                style={{ marginRight: 4 }}
            />
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
        </View>
    );

    // Limit amenities to fit, but make them bigger
    const renderAmenities = () => {
        if (!item.amenities || item.amenities.length === 0) return null;

        // Determine how many amenities we can safely show
        const maxToShow = 2;

        return (
            <View style={styles.amenitiesRow}>
                {item.amenities.slice(0, maxToShow).map((amenity, i) => (
                    <View key={i} style={styles.amenityBadge}>
                        <Text style={styles.amenityText} numberOfLines={1}>
                            {amenity}
                        </Text>
                    </View>
                ))}
                {item.amenities.length > maxToShow && (
                    <View style={styles.amenityBadge}>
                        <Text style={styles.amenityText}>
                            +{item.amenities.length - maxToShow}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

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
                <FastImage
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

                        <View style={styles.ratingRow}>
                            {renderSimpleRating()}
                        </View>

                        <View style={styles.priceRow}>
                            {item.discount_percentage && (
                                <View style={styles.offerView}>
                                    <FontAwesome
                                        name="arrow-down"
                                        size={10}
                                        color="lime"
                                        style={{ marginRight: 2 }}
                                    />
                                    <Text style={styles.offerPercentageText}>
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
                    {renderAmenities()}
                </View>

                {/* Favorite button */}
                <Pressable
                    style={{
                        position: "absolute",
                        alignItems: "center",
                        justifyContent: "center",
                        height: MIN_IMAGE_HEIGHT * 0.24,
                        width: MIN_IMAGE_HEIGHT * 0.24,
                        top: MIN_IMAGE_HEIGHT * 0.08,
                        right: CARD_WIDTH * 0.05,
                        alignSelf: "flex-start",
                        borderRadius: 10,
                        backgroundColor: "rgba(52, 52, 52, 0.24)",
                    }}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <FontAwesome
                        name={isFavorite ? "heart" : "heart-o"}
                        size={20}
                        color={
                            isFavorite
                                ? "rgba(255, 0, 0, 0.80)"
                                : "rgba(255, 255, 255, 0.80)"
                        }
                    />
                </Pressable>
            </Pressable>
        </View>
    );
};

export default StaysCard;

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
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
    },
    priceAlignContainer: {
        flexDirection: "row",
        alignItems: "baseline",
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
    amenitiesRow: {
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        marginTop: 3,
        paddingBottom: 2,
    },
    amenityBadge: {
        backgroundColor: "rgba(52, 52, 52, 0.7)",
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 8,
        marginRight: 5,
        maxWidth: "45%",
    },
    amenityText: {
        fontFamily: "SfProMedium",
        fontSize: 10,
        color: "white",
    },
});
