import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";

const { height } = Dimensions.get("screen");

const Details = () => {
    const identifier = useLocalSearchParams().identifier;

    NavigationBar.setBackgroundColorAsync("#0d1116");

    return (
        <View style={styles.full}>
            <Image
                source={require("@/assets/images/app_images/manas-national-park.jpg")}
                resizeMode="contain"
                style={styles.displayImage}
            />
            <Text style={styles.text}>{identifier}</Text>
            <Text style={styles.subText}>About</Text>
            <View style={{ height: 2, backgroundColor: "#646f7e" }}></View>
            <Text style={styles.details}>
                Lorem Ipsum Dolor Set Ametadfgrtdhyjukiukyjtrgewerty
                trheyuiryeewr rytiuuyretewrq rweyeuukyjtrhregtet eryutetrs
                ertyuy
            </Text>
        </View>
    );
};

export default Details;

const styles = StyleSheet.create({
    full: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#0d1116",
    },
    displayImage: {
        alignSelf: "center",
        height: height * 0.4,
        marginBottom: 20,
    },
    text: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 24,
        fontWeight: "bold",
    },
    subText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    details: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 25,
    },
});
