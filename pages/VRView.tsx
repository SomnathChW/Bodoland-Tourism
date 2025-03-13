import { StyleSheet, StatusBar, View, Text, ScrollView } from "react-native";
import React from "react";

import { VRData } from "@/data/vr_data";

import CardListPage from "@/components/CardListPage";
import { Ionicons } from "@expo/vector-icons";

const VrView = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <View>
                            <Text style={styles.headingText}>
                                Virtual Tours
                            </Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Explore Bodoland from your couch
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>
                <CardListPage itemList={VRData} />
            </View>
        </View>
    );
};

export default VrView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    content: {
        flex: 1,
        backgroundColor: "transparent",
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    buttons: {
        color: "#fff",
    },
    headingText: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        color: "#fff",
    },
    mainSubHeaddingText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#646f7e",
    },
});
