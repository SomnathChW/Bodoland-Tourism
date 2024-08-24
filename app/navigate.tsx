import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";

const Navigate = () => {
    return (
        <View style={styles.full}>
            <Animated.View
                sharedTransitionTag="hello"
                style={{ height: 100, width: 100, backgroundColor: "green" }}
            ></Animated.View>
        </View>
    );
};

export default Navigate;

const styles = StyleSheet.create({
    full: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 24,
        fontWeight: "bold",
    },
});
