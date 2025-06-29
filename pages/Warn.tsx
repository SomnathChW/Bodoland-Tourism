import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Warn = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Warning</Text>
            <Text style={styles.description}>
                This is the warning page of our application.
            </Text>
        </View>
    );
};

export default Warn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d1116",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    description: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginHorizontal: 20,
    },
});
