import React from "react";
import { View, Dimensions } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

const { width, height } = Dimensions.get("screen");
const WIDTH_RATIO = 0.32;
const HEIGHT_RATIO = 0.2;
const NUM_CARDS_ON_SCREEN = 2.85;

const CARD_WIDTH = Math.ceil(width * WIDTH_RATIO);
const CARD_HEIGHT = Math.ceil(height * HEIGHT_RATIO);

const CardVerticalLoader = React.memo(() => {
    const marginHorizontal = Math.ceil(
        (width * (1 - WIDTH_RATIO * NUM_CARDS_ON_SCREEN)) /
            (NUM_CARDS_ON_SCREEN * 2)
    );

    return (
        <View
            style={{
                width: CARD_WIDTH,
                marginHorizontal: marginHorizontal,
                borderRadius: 10,
                backgroundColor: "rgba(52, 52, 52, 0.35)",
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
                {/* Main image area */}
                <Rect
                    x="0"
                    y="0"
                    rx="10"
                    ry="10"
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                />
            </ContentLoader>
        </View>
    );
});

export default CardVerticalLoader;
