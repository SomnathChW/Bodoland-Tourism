import { Text, View, StyleSheet, StatusBar } from "react-native";
import React from "react";

const Attractions = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Attractions Tab</Text>
        </View>
    );
};

export default Attractions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight,
    },
    text: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
    },
});
