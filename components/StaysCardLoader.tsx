import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

const PADDING = 15;
const GAP = 15;
const NUM_CARDS_ON_SCREEN = 2;

const StaysCardLoader = React.memo(
    ({
        index,
        width,
        height,
    }: {
        index: number;
        width: number;
        height: number;
    }) => {
        // Calculate margin based on index to match your StaysCard layout
        const marginLeft = index % 2 === 0 ? PADDING : GAP / 2;
        const marginRight = index % 2 === 0 ? GAP / 2 : PADDING;

        const CARD_WIDTH =
            (width - PADDING * 2 - GAP * (NUM_CARDS_ON_SCREEN - 1)) /
            NUM_CARDS_ON_SCREEN;
        const MIN_CARD_HEIGHT = height * 0.25;
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
                    marginLeft: marginLeft,
                    marginRight: marginRight,
                    overflow: "hidden",
                }}
            >
                <ContentLoader
                    speed={1.2}
                    width={CARD_WIDTH}
                    height={MIN_CARD_HEIGHT}
                    backgroundColor="#1a2027"
                    foregroundColor="#2a3137"
                >
                    {/* Image area */}
                    <Rect
                        x="0"
                        y="0"
                        rx="0"
                        ry="0"
                        width={CARD_WIDTH}
                        height={MIN_IMAGE_HEIGHT}
                    />

                    {/* Title text placeholder */}
                    <Rect
                        x="10"
                        y={MIN_IMAGE_HEIGHT + 8}
                        rx="4"
                        ry="4"
                        width={CARD_WIDTH * 0.85}
                        height="14"
                    />

                    {/* Location text placeholder */}
                    <Rect
                        x="10"
                        y={MIN_IMAGE_HEIGHT + 28}
                        rx="3"
                        ry="3"
                        width={CARD_WIDTH * 0.7}
                        height="12"
                    />

                    {/* Rating placeholder */}
                    <Rect
                        x="10"
                        y={MIN_IMAGE_HEIGHT + 45}
                        rx="3"
                        ry="3"
                        width={CARD_WIDTH * 0.2}
                        height="12"
                    />

                    {/* Price placeholder */}
                    <Rect
                        x="10"
                        y={MIN_IMAGE_HEIGHT + 62}
                        rx="3"
                        ry="3"
                        width={CARD_WIDTH * 0.3}
                        height="12"
                    />

                    {/* Favorite button placeholder */}
                    <Rect
                        x={
                            CARD_WIDTH -
                            MIN_IMAGE_HEIGHT * 0.24 -
                            CARD_WIDTH * 0.05
                        }
                        y={MIN_IMAGE_HEIGHT * 0.08}
                        rx="10"
                        ry="10"
                        width={MIN_IMAGE_HEIGHT * 0.24}
                        height={MIN_IMAGE_HEIGHT * 0.24}
                    />
                </ContentLoader>
            </View>
        );
    }
);

export default StaysCardLoader;
