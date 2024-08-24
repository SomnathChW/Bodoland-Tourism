import { Text, View, StyleSheet } from "react-native";
import React from "react";

const Souvenirs = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Souvenirs Tab</Text>
        </View>
    );
};

export default Souvenirs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
    },
});
