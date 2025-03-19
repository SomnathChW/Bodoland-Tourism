import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "@/context/AuthContext";

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
                <Stack.Screen
                    name="(protected)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="signin"
                    options={{
                        title: "Sign In",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="password_recovery"
                    options={{
                        title: "Sign Up",
                        headerShown: false,
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutContent />
        </AuthProvider>
    );
}
