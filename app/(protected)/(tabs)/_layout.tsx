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

    const url = Linking.useLinkingURL();
    console.log("URL", url);

    const router = useRouter();

    const handleDeepLink = (url: string) => {
        const route = url.split("/").pop();
        if (route) {
            router.push(("/" + route) as any);
        }
    };
    const handleUrl = (event: { url: string }) => {
        const { url } = event;
        handleDeepLink(url);
    };

    React.useEffect(() => {
        if (!url) return;
        handleUrl({ url: url });
        const subscription = Linking.addEventListener("url", handleUrl);
        return () => {
            subscription.remove();
        };
    }, [url]);

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
