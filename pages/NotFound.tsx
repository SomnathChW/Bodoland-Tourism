import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type NotFoundProps = {
    message?: string;
    overrideHandleBackPress?: () => void;
};

const NotFound = ({ overrideHandleBackPress, message }: NotFoundProps) => {
    const router = useRouter();

    const handleBackPress = () => {
        if (router.canGoBack()) {
            router.back();
            return;
        }
        router.replace({ pathname: "/", params: {} });
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Ionicons
                name="warning-outline"
                size={100}
                color="white"
                style={{ marginBottom: 20 }}
            />
            <Text
                style={{
                    fontSize: 20,
                    color: "white",
                    marginBottom: 2,
                    fontWeight: "bold",
                }}
            >
                Page Not Found
            </Text>
            <Text style={{ fontSize: 16, color: "gray", marginBottom: 20 }}>
                {message || "The page you are looking for does not exist."}
            </Text>
            <TouchableOpacity
                onPress={overrideHandleBackPress || handleBackPress}
                style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 5,
                    width: "80%",
                    marginTop: 10,
                    alignItems: "center",
                }}
                activeOpacity={0.6}
            >
                <Text
                    style={{
                        color: "black",
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Go Back
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default NotFound;
