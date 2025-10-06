import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Drawer from "@/components/UI/Drawer/Drawer";
import { DrawerProvider } from "@/context/DrawerContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";

const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 60 * 1000,
            gcTime: 60 * 60 * 1000,
        },
    },
});

const StackLayout = React.memo(() => {
    const screens = [
        { name: "details", title: "Details" },
        { name: "checkout", title: "Checkout" },
        { name: "festivals", title: "Festivals" },
        { name: "cuisines", title: "Cuisine" },
        { name: "transport", title: "Transport" },
        { name: "about", title: "About" },
        { name: "emergency_contacts", title: "Emergency Contacts" },
        { name: "settings", title: "Settings" },
        { name: "help", title: "Help" },
        { name: "orders", title: "Orders" },
        { name: "cart", title: "Cart" },
        { name: "privacy", title: "Privacy Policy" },
        { name: "feedback", title: "Feedback" },
    ];

    return (
        <QueryClientProvider client={client}>
            <Stack
                initialRouteName="(tabs)"
                screenOptions={{
                    animation: "ios_from_right",
                    statusBarAnimation: "slide",
                    animationDuration: 300,
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                {screens.map((items) => (
                    <Stack.Screen
                        key={items.name}
                        name={items.name}
                        options={{
                            title: items.title,
                            headerShown: false,
                        }}
                    />
                ))}
                <Stack.Screen
                    name="3d_view"
                    options={{
                        title: "3D View",
                        headerShown: false,
                        navigationBarHidden: true,
                    }}
                />
                <Stack.Screen
                    name="ar_view"
                    options={{
                        title: "AR View",
                        headerShown: false,
                        navigationBarHidden: true,
                    }}
                />
                <Stack.Screen
                    name="vr_view"
                    options={{
                        title: "VR View",
                        headerShown: false,
                        navigationBarHidden: true,
                    }}
                />
            </Stack>
            <Drawer />
        </QueryClientProvider>
    );
});

const _layout = React.memo(() => {
    const { session, loading, isAppReady } = useAuth();

    if (!isAppReady) {
        return <View style={styles.container} />;
    }

    // If no session and not loading, redirect to sign in
    if (!session && !loading) {
        return <Redirect href="/signin" />;
    }

    if (session && isAppReady) {
        return (
            <DrawerProvider>
                <StackLayout />
            </DrawerProvider>
        );
    }
});

export default _layout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a223c",
    },
});
