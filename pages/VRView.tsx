import { StyleSheet, StatusBar, View, Text, ScrollView } from "react-native";
import React from "react";

import { VRData } from "@/data/vr_data";

import { Ionicons } from "@expo/vector-icons";
import VrCard from "@/components/VrCard";
import { FlashList } from "@shopify/flash-list";

const VrView = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Ionicons
                            name="menu"
                            size={30}
                            style={styles.buttons}
                        />
                        <View>
                            <Text style={styles.headingText}>
                                Virtual Tours
                            </Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Explore the beauty of Bodoland
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>
                <FlashList
                    data={VRData}
                    renderItem={({ item, index }) => (
                        <VrCard item={item} index={index} />
                    )}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    estimatedItemSize={30}
                />
            </View>
        </View>
    );
};

export default VrView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
        paddingTop: StatusBar.currentHeight,
    },
    content: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
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
