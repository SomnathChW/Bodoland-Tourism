import { Text, View, StyleSheet } from "react-native";
import React from "react";

const Festivals = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Festivals Tab</Text>
        </View>
    );
};

export default Festivals;

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
