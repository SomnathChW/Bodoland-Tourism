import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

const { width, height } = Dimensions.get("screen");

const CarouselLoader = React.memo(() => {
    // Match the dimensions from CarouselCard
    const CARD_WIDTH = width * 0.8;
    const CARD_HEIGHT = height * 0.22;
    // Apply the same scale transform as in CarouselCard (1.1)
    const SCALED_CARD_WIDTH = CARD_WIDTH * 1.1;
    const SCALED_CARD_HEIGHT = CARD_HEIGHT * 1.1;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ContentLoader
                    speed={1.2}
                    width={SCALED_CARD_WIDTH}
                    height={SCALED_CARD_HEIGHT}
                    backgroundColor="#1a2027"
                    foregroundColor="#2a3137"
                >
                    <Rect
                        x="0"
                        y="0"
                        rx="10"
                        ry="10"
                        width={SCALED_CARD_WIDTH}
                        height={SCALED_CARD_HEIGHT}
                    />
                </ContentLoader>
            </View>
            {/* Placeholder for dots */}
            <View style={styles.dotsContainer}>
                <View style={styles.activeDot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: width,
        alignItems: "center",
        marginVertical: 10,
    },
    card: {
        width: width * 0.8 * 1.1, // Apply the same scale transform as in CarouselCard
        height: height * 0.22 * 1.1, // Apply the same scale transform as in CarouselCard
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "rgba(52, 52, 52, 0.35)",
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginHorizontal: 2,
    },
    activeDot: {
        width: 60,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        marginHorizontal: 2,
    },
});

export default CarouselLoader;
