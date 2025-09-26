import "react-native-gesture-handler";
import "react-native-reanimated";

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, StatusBar } from "react-native";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import NoInternetScreen from "@/components/Warnings/NoInternetScreen";
import UpdateScreen from "@/components/Warnings/UpdateScreen";
import LottieView from "lottie-react-native";

SplashScreen.preventAutoHideAsync();

const RootLayoutContent = React.memo(() => {
    const [fontsLoaded] = useFonts({
        SfProMedium: require("../assets/fonts/sf-pro-display-medium.otf"),
    });

    const {
        loading,
        isAppVersionGreaterThanRequired,
        isInternetConnected,
        isAppReady,
    } = useAuth();

    useEffect(() => {
        if (fontsLoaded && !loading && isAppReady) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, loading, isAppReady]);

    const showOverlay = !fontsLoaded || loading;

    if (!isInternetConnected) {
        return <NoInternetScreen />;
    }

    if (!isAppVersionGreaterThanRequired) {
        return <UpdateScreen />;
    }

    return (
        <ThemeProvider value={DarkTheme}>
            <StatusBar barStyle="light-content" />
            <Stack
                initialRouteName="signin"
                screenOptions={{
                    contentStyle: { backgroundColor: "#0d1116" },
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
                        theme="dark"
                    />
                </AuthProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
