import "react-native-gesture-handler";
import "react-native-reanimated";

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
    const [loaded] = useFonts({
        SfProMedium: require("../assets/fonts/sf-pro-display-medium.otf"),
    });

    const { loading } = useAuth();

    useEffect(() => {
        if (loaded && !loading) {
            SplashScreen.hideAsync();
        }
    }, [loaded, loading]);

    if (!loaded || loading) {
        return null;
    }

    return (
        <ThemeProvider value={DarkTheme}>
            <StatusBar style="light" />
            <Stack
                initialRouteName="signin"
                screenOptions={{
                    contentStyle: { backgroundColor: "#0d1116" },
                }}
            >
                {["(protected)", "signin", "password_recovery"].map((name) => (
                    <Stack.Screen
                        key={name}
                        name={name}
                        options={{
                            headerShown: false,
                        }}
                    />
                ))}
            </Stack>
        </ThemeProvider>
    );
}

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
