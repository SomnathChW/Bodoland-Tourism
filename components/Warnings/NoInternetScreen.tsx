import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const NoInternetScreen = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#0d1116",
            }}
        >
            <MaterialIcons
                style={{ marginBottom: 16 }}
                name="signal-wifi-connected-no-internet-4"
                size={100}
                color="white"
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
                No internet connection detected. Please check your network
                settings and try again and{" "}
                <Text style={{ fontWeight: "bold" }}>RESTART</Text> the app.
            </Text>
        </View>
    );
};

export default NoInternetScreen;
