import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

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
        <ThemeProvider value={DarkTheme}>
            <StatusBar style="dark" />
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="details"
                    options={{
                        title: "Details",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="festivals"
                    options={{
                        title: "Festivals",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="cuisine"
                    options={{
                        title: "Cuisine",
                        headerShown: false,
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
}
