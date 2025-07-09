import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Drawer from "@/components/UI/Drawer/Drawer";
import { DrawerProvider } from "@/context/DrawerContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        { name: "festivals", title: "Festivals" },
        { name: "cuisine", title: "Cuisine" },
        { name: "transport", title: "Transport" },
        { name: "about", title: "About" },
        { name: "emergency_contacts", title: "Emergency Contacts" },
        { name: "settings", title: "Settings" },
        { name: "help", title: "Help" },
        { name: "orders", title: "Orders" }, // New screen for orders
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
                        navigationBarColor: "#000000",
                    }}
                />
                {screens.map((items) => (
                    <Stack.Screen
                        key={items.name}
                        name={items.name}
                        options={{
                            title: items.title,
                            headerShown: false,
                            navigationBarColor: "#0d1116",
                        }}
                    />
                ))}
                <Stack.Screen
                    name="3d-view"
                    options={{
                        title: "3D View",
                        headerShown: false,
                        navigationBarHidden: true,
                    }}
                />
                <Stack.Screen
                    name="ar-view"
                    options={{
                        title: "AR View",
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
    const { session } = useAuth();

    return !session ? (
        <Redirect href="/signin" />
    ) : (
        <DrawerProvider>
            <StackLayout />
        </DrawerProvider>
    );
});

export default _layout;
