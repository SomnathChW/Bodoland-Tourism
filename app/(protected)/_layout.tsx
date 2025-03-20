import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const StackLayout = () => {
    return (
        <Stack initialRouteName="(tabs)">
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
    );
};

const _layout = () => {
    const { session } = useAuth();

    return !session ? <Redirect href="/signin" /> : <StackLayout />;
};

export default _layout;
