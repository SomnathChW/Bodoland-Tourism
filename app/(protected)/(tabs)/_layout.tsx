import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import { useIsFocused } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";

const _layout = () => {
    if (useIsFocused()) {
        NavigationBar.setBackgroundColorAsync("#000000");
    }

    const screens = [
        { name: "attractions", title: "Attractions" },
        { name: "stays", title: "Stays" },
        { name: "index", title: "Home" },
        { name: "vrview", title: "Virtual Tour" },
        { name: "souvenirs", title: "Souvenirs" },
    ];

    return (
        <Tabs
            backBehavior="initialRoute"
            initialRouteName="index"
            tabBar={(props) => <TabBar {...props} />}
        >
            {screens.map((items) => (
                <Tabs.Screen
                    key={items.name}
                    name={items.name}
                    options={{
                        title: items.title,
                        headerShown: false,
                    }}
                />
            ))}
        </Tabs>
    );
};

export default _layout;
