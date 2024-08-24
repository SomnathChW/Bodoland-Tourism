import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import * as SystemUI from "expo-system-ui";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

async function setBackgroundColor() {
    await SystemUI.setBackgroundColorAsync("#0d1116");
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SfProMedium: require("../assets/fonts/sf-pro-display-medium.otf"),
    });
    useEffect(() => {
        if (loaded) {
            setBackgroundColor();
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={DarkTheme}>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="navigate"
                    options={{
                        title: "Home",
                        headerShown: false,
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
}
