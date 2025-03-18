import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SfProMedium: require("../assets/fonts/sf-pro-display-medium.otf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
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
        </AuthProvider>
    );
}
