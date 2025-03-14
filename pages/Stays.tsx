import { Text, View, StyleSheet, StatusBar, Dimensions } from "react-native";
import {
    Canvas,
    Rect,
    Paint,
    RadialGradient,
} from "@shopify/react-native-skia";
import React from "react";

const { height, width } = Dimensions.get("screen");

const Stays = () => {
    return (
        <View style={styles.container}>
            <Canvas style={{ flex: 1 }}>
                <Rect x={0} y={0} width={width} height={height}>
                    <RadialGradient
                        c={{
                            x: width / 2,
                            y: height / 2 - (StatusBar.currentHeight || 0),
                        }}
                        r={width / 2}
                        colors={["violet", "black"]}
                    />
                </Rect>
            </Canvas>
        </View>
    );
};

export default Stays;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
