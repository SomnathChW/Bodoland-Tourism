import React from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = height * 0.45;

const HeaderLoader = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

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

            {/* Real Back Button - Floating */}
            <TouchableOpacity
                style={{
                    position: "absolute",
                    top: insets.top + 10,
                    left: 20,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                }}
                onPress={() => router.back()}
                activeOpacity={0.8}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

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
