import { StyleSheet, View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Linking } from "react-native";

const VRViewFullScreen = () => {
    const params = useLocalSearchParams();
    // Get tour_resource from route parameters
    const tour_resource = params?.tour_resource as string;

    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleCardboardMode = () => {
        Linking.openURL(
            `https://coolidance.appwrite.network/?img=${tour_resource}`
        );
    };

    const [loading, setLoading] = React.useState(true);

    return (
        <>
            <WebView
                source={
                    loading
                        ? {
                              html: `<html><body style="background:black;display:flex;justify-content:center;align-items:center;height:100vh;"><h1 style="color:white;font-size:18px;">Loading VR Experience...</h1></body></html>`,
                          }
                        : {
                              uri: `https://coolidance.appwrite.network/?img=${tour_resource}`,
                          }
                }
                style={styles.webView}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                onLoadEnd={() => {
                    setLoading(false);
                }}
                onError={() => {
                    setLoading(false);
                }}
            />
            <View
                style={[
                    styles.floatingButtonsContainer,
                    { top: insets.top + 10 },
                ]}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.floatingBackButton}
                    onPress={handleBack}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Cardboard Mode Button */}
                <TouchableOpacity
                    style={[styles.cardboardButton]}
                    onPress={handleCardboardMode}
                    activeOpacity={0.8}
                >
                    <FontAwesome6 name="vr-cardboard" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default VRViewFullScreen;

const styles = StyleSheet.create({
    webView: {
        flex: 1,
        backgroundColor: "black",
    },
    floatingButtonsContainer: {
        position: "absolute",
        left: 20,
        flexDirection: "row",
        gap: 12,
        zIndex: 10,
    },
    floatingBackButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    cardboardButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
});
