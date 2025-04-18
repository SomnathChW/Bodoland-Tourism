import "react-native-gesture-handler";
import "react-native-reanimated";

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import LottieView from "lottie-react-native";

SplashScreen.preventAutoHideAsync();

const RootLayoutContent = React.memo(() => {
    const [loaded] = useFonts({
        SfProMedium: require("../assets/fonts/sf-pro-display-medium.otf"),
    });

    const { loading } = useAuth();

    useEffect(() => {
        if (loaded && !loading) {
            SplashScreen.hideAsync();
        }
    }, [loaded, loading]);

    const showOverlay = !loaded || loading;

    return (
        <ThemeProvider value={DarkTheme}>
            <StatusBar style="light" />
            <Stack
                initialRouteName="signin"
                screenOptions={{
                    contentStyle: { backgroundColor: "#0d1116" },
                    navigationBarColor: "#0d1116",
                    animation: "ios_from_right",
                    statusBarAnimation: "slide",
                }}
            >
                {[
                    "(protected)",
                    "signin",
                    "password_recovery",
                    "+not-found",
                ].map((name) => (
                    <Stack.Screen
                        key={name}
                        name={name}
                        options={{
                            headerShown: false,
                        }}
                    />
                ))}
            </Stack>
            {showOverlay && (
                <View style={styles.overlay}>
                    <LottieView
                        source={require("@/assets/lottie/loading.json")}
                        style={{ width: "70%", height: "70%" }}
                        autoPlay
                        loop
                    />
                </View>
            )}
        </ThemeProvider>
    );
});

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <AuthProvider>
                    <RootLayoutContent />
                    <Toaster
                        toastOptions={{
                            style: {
                                backgroundColor: "rgba(50, 50, 50, 1)",
                            },
                        }}
                        position="bottom-center"
                        visibleToasts={1}
                        swipeToDismissDirection="left"
                    />
                </AuthProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
    },
});
