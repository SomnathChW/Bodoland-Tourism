import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
        <View style={styles.container}>
            <Ionicons
                name="warning-outline"
                size={100}
                color="white"
                style={styles.icon}
            />
            <Text style={styles.title}>Not Found</Text>
            <Text style={styles.message}>
                {message || "The item you are looking for does not exist."}
            </Text>
            <TouchableOpacity
                onPress={handleBackPress}
                style={styles.button}
                activeOpacity={0.6}
            >
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DetailsError;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d1116",
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        color: "white",
        marginBottom: 2,
        fontWeight: "bold",
    },
    message: {
        fontSize: 16,
        color: "gray",
        marginBottom: 20,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        width: "80%",
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
