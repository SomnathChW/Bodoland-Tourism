import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import FastImage from "react-native-fast-image";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { CarouselTypes } from "./Carousel";

type Props = {
    item: CarouselTypes;
    index: number;
    scrollX: SharedValue<number>;
};

const { width, height } = Dimensions.get("screen");

const CarouselCard = React.memo(({ item, index, scrollX }: Props) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ],
                        [-width * 0.15, 0, width * 0.15],
                        Extrapolation.CLAMP
                    ),
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ],
                        [0.95, 1.1, 0.95],
                        Extrapolation.CLAMP
                    ),
                },
            ],
        };
    }, [index]);

    const displayText = React.useMemo(
        () =>
            item.description.length > 50
                ? `${item.description.slice(0, 50)}...`
                : item.description,
        [item.description]
    );

    const handlePress = () => {
        if (item.type === "details") {
            router.navigate({
                pathname: "/details",
                params: { identifier: item.identifier },
            });
        } else if (item.type === "browser" && item.promo_url) {
            Linking.openURL(item.promo_url);
        }
        // If type is "none" or any other value, do nothing
    };

    return (
        <TouchableOpacity 
            activeOpacity={1} 
            onPress={handlePress}
            disabled={item.type === "none"}
        >
            <Animated.View style={[styles.card, animatedStyle]}>
                <FastImage source={{ uri: item.image }} style={styles.image} />
                <LinearGradient
                    colors={["transparent", " rgba(0, 0, 0, 0.6)"]}
                    style={styles.textView}
                >
                    {item.tag && (
                        <View style={styles.tagView}>
                            <Text style={styles.tag}>{item.tag}</Text>
                        </View>
                    )}
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description} numberOfLines={1}>
                        {displayText}
                    </Text>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
});

const areEqual = (prevProps: Props, nextProps: Props) => {
    return (
        prevProps.item.title === nextProps.item.title &&
        prevProps.item.description === nextProps.item.description &&
        prevProps.item.tag === nextProps.item.tag &&
        prevProps.index === nextProps.index
    );
};

export default React.memo(CarouselCard, areEqual);

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        justifyContent: "center",
        width,
        marginVertical: 10,
    },
    image: {
        width: width * 0.8,
        height: height * 0.22,
        borderRadius: 10,
    },
    textView: {
        position: "absolute",
        width: width * 0.8,
        height: height * 0.22,
        padding: 15,
        borderRadius: 10,
        justifyContent: "flex-end",
    },
    tagView: {
        backgroundColor: "#ff6b81",
        padding: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        marginBottom: 5,
        marginHorizontal: 5,
    },
    tag: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        fontWeight: "bold",
        color: "black",
        marginVertical: 2,
        marginHorizontal: 5,
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        letterSpacing: 1.2,
        marginHorizontal: 5,
    },
    description: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "white",
        marginVertical: 2,
        marginHorizontal: 5,
    },
});
