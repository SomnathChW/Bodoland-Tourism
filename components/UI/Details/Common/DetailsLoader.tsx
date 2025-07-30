import React from "react";
import { View, Dimensions } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

const { width } = Dimensions.get("window");
const PADDING = 20;
const CONTENT_WIDTH = width - PADDING * 2;

const DetailsLoader = () => {
    return (
        <View style={{ paddingTop: PADDING, flex: 1 }}>
            {/* Title - 75% width */}
            <ContentLoader
                speed={1.5}
                width={CONTENT_WIDTH}
                height={50}
                backgroundColor="#1a2027"
                foregroundColor="#2a3137"
                viewBox="0 0 400 50"
            >
                <Rect
                    x="0"
                    y="5"
                    rx="5"
                    ry="5"
                    width={CONTENT_WIDTH * 0.75}
                    height="25"
                />
                {/* Subtitle - 50% width */}
                <Rect
                    x="0"
                    y="40"
                    rx="4"
                    ry="4"
                    width={CONTENT_WIDTH * 0.5}
                    height="15"
                />
            </ContentLoader>

            {/* Description placeholder */}
            <ContentLoader
                style={{ marginTop: 20 }}
                speed={1.5}
                width={CONTENT_WIDTH}
                height={80}
                backgroundColor="#1a2027"
                foregroundColor="#2a3137"
            >
                <Rect x="0" y="0" rx="3" ry="3" width="100%" height="10" />
                <Rect x="0" y="20" rx="3" ry="3" width="90%" height="10" />
                <Rect x="0" y="40" rx="3" ry="3" width="95%" height="10" />
                <Rect x="0" y="60" rx="3" ry="3" width="80%" height="10" />
            </ContentLoader>

            {/* Two cards horizontally */}
            <View style={{ flexDirection: "row", marginTop: 30 }}>
                {/* Card 1 */}
                <View style={{ flex: 1, marginRight: 10 }}>
                    <ContentLoader
                        speed={1.5}
                        width={(CONTENT_WIDTH - 10) / 2}
                        height={180}
                        backgroundColor="#1a2027"
                        foregroundColor="#2a3137"
                    >
                        <Rect
                            x="0"
                            y="0"
                            rx="8"
                            ry="8"
                            width="100%"
                            height="120"
                        />
                        <Rect
                            x="0"
                            y="130"
                            rx="4"
                            ry="4"
                            width="80%"
                            height="15"
                        />
                        <Rect
                            x="0"
                            y="155"
                            rx="3"
                            ry="3"
                            width="60%"
                            height="12"
                        />
                    </ContentLoader>
                </View>

                {/* Card 2 */}
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <ContentLoader
                        speed={1.5}
                        width={(CONTENT_WIDTH - 10) / 2}
                        height={180}
                        backgroundColor="#1a2027"
                        foregroundColor="#2a3137"
                    >
                        <Rect
                            x="0"
                            y="0"
                            rx="8"
                            ry="8"
                            width="100%"
                            height="120"
                        />
                        <Rect
                            x="0"
                            y="130"
                            rx="4"
                            ry="4"
                            width="80%"
                            height="15"
                        />
                        <Rect
                            x="0"
                            y="155"
                            rx="3"
                            ry="3"
                            width="60%"
                            height="12"
                        />
                    </ContentLoader>
                </View>
            </View>

            {/* Additional content loader for more elements */}
            <ContentLoader
                style={{ marginTop: 30 }}
                speed={1.5}
                width={CONTENT_WIDTH}
                height={150}
                backgroundColor="#1a2027"
                foregroundColor="#2a3137"
            >
                <Rect x="0" y="0" rx="5" ry="5" width="40%" height="20" />
                <Rect x="0" y="35" rx="5" ry="5" width="100%" height="1" />
                <Rect x="0" y="50" rx="8" ry="8" width="100%" height="90" />
            </ContentLoader>
        </View>
    );
};

export default DetailsLoader;
