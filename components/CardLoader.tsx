import React from "react";
import { View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

const PADDING = 15;
const GAP = 15;
const NUM_CARDS_ON_SCREEN = 2;

const CardLoader = React.memo(
    ({
        index,
        width,
        height,
    }: {
        index: number;
        width: number;
        height: number;
    }) => {
        const marginLeft = index % 2 === 0 ? PADDING : GAP / 2;
        const marginRight = index % 2 === 0 ? GAP / 2 : PADDING;

        const CARD_WIDTH =
            (width - PADDING * 2 - GAP * (NUM_CARDS_ON_SCREEN - 1)) /
            NUM_CARDS_ON_SCREEN;
        const CARD_HEIGHT = height * 0.25;

        return (
            <View
                style={{
                    width: CARD_WIDTH,
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
                    height={CARD_HEIGHT} 
                    backgroundColor="#1a2027"
                    foregroundColor="#2a3137"
                >
                    <Rect
                        x="0"
                        y="0"
                        rx="0"
                        ry="0"
                        width={CARD_WIDTH}
                        height={CARD_HEIGHT}
                    />
                </ContentLoader>
            </View>
        );
    }
);

export default CardLoader;
