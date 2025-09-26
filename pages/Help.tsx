import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/UI/PageHeader/Header";

const Help = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                headingText="Help"
                subHeadingText="Get assistance and support"
            />

            <View style={styles.pageContent}>
                <Text style={styles.title}>Help</Text>
                <Text style={styles.description}>
                    This is the help page of our application.
                </Text>
            </View>
        </View>
    );
};

export default Help;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    content: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "transparent",
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    headingText: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
    },
    mainSubHeaddingText: {
        fontSize: 14,
        color: "#8E8E93",
        fontFamily: "SF-Pro-Display-Medium",
    },
    buttons: {
        color: "white",
    },
    pageContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#8E8E93",
        textAlign: "center",
        lineHeight: 24,
    },
});
