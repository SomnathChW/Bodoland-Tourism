import React from "react";
import { Tabs, useRouter } from "expo-router";
import { TabBar } from "@/components/UI/TabBar/TabBar";

import * as Linking from "expo-linking";

const _layout = React.memo(() => {
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
            detachInactiveScreens={false}
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
});

export default _layout;
