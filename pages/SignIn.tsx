import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

const SignInPage = () => {
    const { session, signIn } = useAuth();

    if (session) {
        return <Redirect href="/(protected)/(tabs)" />;
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>SignIn</Text>
            <Button title="Sign In" onPress={signIn} />
        </View>
    );
};

export default SignInPage;

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
