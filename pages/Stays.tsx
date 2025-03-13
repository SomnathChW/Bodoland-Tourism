import { Text, View, StyleSheet, StatusBar } from "react-native";
import React from "react";

const Stays = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Stays Tab</Text>
        </View>
    );
};

export default Stays;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0d1116",
        paddingTop: StatusBar.currentHeight,
    },
    text: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
    },
});
