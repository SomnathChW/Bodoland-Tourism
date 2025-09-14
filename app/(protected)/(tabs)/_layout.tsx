import React from "react";
import { Tabs, useRouter } from "expo-router";
import { TabBar } from "@/components/UI/TabBar/TabBar";

import * as Linking from "expo-linking";

const validPages = [
    "attractions",
    "stays",
    "index",
    "virtual_tours",
    "souvenirs",
    "festivals",
    "cuisines",
    "details",
];

const isValidRoute = (page: string | undefined) => {
    if (page === undefined || page === null || !page) {
        return false;
    }
    // Remove query params and fragments
    const cleanPage = page.split(/[?#]/)[0];
    return validPages.some(
        (valid) => cleanPage === valid || cleanPage.startsWith(valid + "/")
    );
};

const _layout = React.memo(() => {
    const screens = [
        { name: "attractions", title: "Attractions" },
        { name: "stays", title: "Stays" },
        { name: "index", title: "Home" },
        { name: "virtual_tours", title: "Virtual Tour" },
        { name: "souvenirs", title: "Souvenirs" },
    ];
    const url = Linking.useLinkingURL();

    const router = useRouter();

    const handleDeepLink = (url: string) => {
        // console.log("Handling deep link:", url);
        const route = url.split("/").pop();
        if (!isValidRoute(route)) {
            return;
        }
        if (route) {
            router.push(("/" + route) as any);
        }
    };
    const handleUrl = (event: { url: string }) => {
        const { url } = event;
        handleDeepLink(url);
    };

    React.useEffect(() => {
        if (url) {
            handleUrl({ url: url });
            const subscription = Linking.addEventListener("url", handleUrl);
            return () => {
                subscription.remove();
            };
        }
    }, []);

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
