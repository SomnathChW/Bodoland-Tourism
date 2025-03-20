import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Linking from "expo-linking";

const PasswordRecoveryPage = () => {
    const url = Linking.useURL();

    if (url) {
        const { hostname, path, queryParams } = Linking.parse(url);

        console.log(
            `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
                queryParams
            )}`
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Password Recovery</Text>
        </View>
    );
};

export default PasswordRecoveryPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        color: "white",
    },
});
