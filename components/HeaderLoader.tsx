import React from "react";
import { View, Dimensions } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = height * 0.45;

const HeaderLoader = () => {
    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "#0d1116",
            }}
        >
            {/* Main header image loader */}
            <ContentLoader
                speed={1.5}
                width={width}
                height={HEADER_MAX_HEIGHT}
                backgroundColor="#1a2027"
                foregroundColor="#2a3137"
                viewBox={`0 0 ${width} ${HEADER_MAX_HEIGHT}`}
            >
                <Rect x="0" y="0" width={width} height={HEADER_MAX_HEIGHT} />
            </ContentLoader>

            {/* Back button and controls placeholder */}
            <View
                style={{
                    position: "absolute",
                    top: 50,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                }}
            >
                <ContentLoader
                    speed={1.5}
                    width={40}
                    height={40}
                    backgroundColor="#1a2027"
                    foregroundColor="#2a3137"
                    viewBox="0 0 40 40"
                >
                    <Rect x="0" y="0" rx="20" ry="20" width="40" height="40" />
                </ContentLoader>

                <View style={{ flexDirection: "row" }}>
                    <ContentLoader
                        speed={1.5}
                        width={40}
                        height={40}
                        backgroundColor="#1a2027"
                        foregroundColor="#2a3137"
                        viewBox="0 0 40 40"
                        style={{ marginRight: 10 }}
                    >
                        <Rect
                            x="0"
                            y="0"
                            rx="20"
                            ry="20"
                            width="40"
                            height="40"
                        />
                    </ContentLoader>

                    <ContentLoader
                        speed={1.5}
                        width={40}
                        height={40}
                        backgroundColor="#1a2027"
                        foregroundColor="#2a3137"
                        viewBox="0 0 40 40"
                    >
                        <Rect
                            x="0"
                            y="0"
                            rx="20"
                            ry="20"
                            width="40"
                            height="40"
                        />
                    </ContentLoader>
                </View>
            </View>

            {/* Pagination indicator placeholder */}
            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <ContentLoader
                    speed={1.5}
                    width={100}
                    height={10}
                    backgroundColor="#1a2027"
                    foregroundColor="#2a3137"
                    viewBox="0 0 100 10"
                >
                    <Rect x="0" y="0" rx="5" ry="5" width="100" height="10" />
                </ContentLoader>
            </View>
        </View>
    );
};

export default HeaderLoader;
