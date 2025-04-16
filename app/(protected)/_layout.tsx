import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Drawer from "@/components/UI/Drawer/Drawer";
import { DrawerProvider } from "@/context/DrawerContext";

const StackLayout = React.memo(() => {
    const screens = [
        { name: "details", title: "Details" },
        { name: "festivals", title: "Festivals" },
        { name: "cuisine", title: "Cuisine" },
    ];

    return (
        <>
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
            </Stack>
            <Drawer />
        </>
    );
});

const _layout = () => {
    const { session } = useAuth();

    return !session ? (
        <Redirect href="/signin" />
    ) : (
        <DrawerProvider>
            <StackLayout />
        </DrawerProvider>
    );
};

export default _layout;
