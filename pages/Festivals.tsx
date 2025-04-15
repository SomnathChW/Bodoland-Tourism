import { Text, View, StyleSheet, StatusBar, Dimensions } from "react-native";
import React from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import FestivalsCard from "@/components/FestivalsCard";
import { festivalsData } from "@/data/festivals_data";

const Festivals = () => {
    const { toggleDrawer } = useDrawer();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Ionicons
                            name="menu"
                            size={30}
                            style={styles.buttons}
                            onPress={toggleDrawer}
                        />
                        <View>
                            <Text style={styles.headingText}>Festivals</Text>
                            <Text
                                style={styles.mainSubHeaddingText}
                                numberOfLines={1}
                            >
                                Explore the rich culture of Bodoland
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>
                <FlashList
                    data={festivalsData}
                    renderItem={({ item, index }) => (
                        <FestivalsCard item={item} index={index} />
                    )}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    estimatedItemSize={30}
                    keyExtractor={(item) => item.identifier}
                    contentContainerStyle={{}}
                />
            </View>
        </View>
    );
};

export default Festivals;

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
