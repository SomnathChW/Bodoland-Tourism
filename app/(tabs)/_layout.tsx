import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import { useIsFocused } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";

const _layout = () => {
    if (useIsFocused()) {
        NavigationBar.setBackgroundColorAsync("#000000");
    }

    return (
        <Tabs
            backBehavior="initialRoute"
            initialRouteName="index"
            tabBar={(props) => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="attractions"
                options={{
                    title: "Attractions",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="stays"
                options={{
                    title: "Stays",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="vrview"
                options={{
                    title: "Virtual Tour",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="souvenirs"
                options={{
                    title: "Souvenirs",
                    headerShown: false,
                }}
            />
        </Tabs>
    );
};

export default _layout;
