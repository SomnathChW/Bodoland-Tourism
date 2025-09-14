import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";

const UpdateScreen = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#0d1116",
            }}
        >
            <Ionicons
                style={{ marginBottom: 16 }}
                name="warning-outline"
                size={100}
                color="#fff"
            />
            <Text
                style={{
                    color: "#fff",
                    width: "80%",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "500",
                }}
            >
                Please update the app from the Play Store to the latest version
                to continue enjoying
            </Text>
            <TouchableOpacity
                style={{
                    marginTop: 16,
                    backgroundColor: "#fff",
                    padding: 12,
                    borderRadius: 8,
                }}
                onPress={() => {
                    if (Platform.OS === "android") {
                        Linking.openURL(
                            "https://play.google.com/store/apps/details?id=in.coolidance.btrtourism"
                        );
                    }
                }}
                activeOpacity={0.85}
            >
                <Text
                    style={{
                        color: "#0d1116",
                        fontSize: 16,
                        fontWeight: "500",
                    }}
                >
                    Open Play Store
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateScreen;
