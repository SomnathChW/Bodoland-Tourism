import React from "react";
import { useRouter } from "expo-router";
import NotFound from "@/pages/NotFound";

const DetailsError = ({ message }: { message?: string }) => {
    const router = useRouter();

    const handleBackPress = () => {
        if (router.canGoBack()) {
            router.back();
            return;
        }
        router.replace({ pathname: "/(protected)/(tabs)", params: {} });
    };

    return (
        <NotFound
            overrideHandleBackPress={handleBackPress}
            message={message || "The item you are looking for does not exist."}
        />
    );
};

export default DetailsError;