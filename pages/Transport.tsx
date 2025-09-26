import { Text, View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useDrawer } from "@/context/DrawerContext";
import { FlashList } from "@shopify/flash-list";
import CuisineCard from "@/components/UI/ItemCards/CuisineCard";
import MenuButton from "@/components/UI/PageHeader/MenuButton";
import { cuisineData } from "@/data/cuisine_data";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("screen");

const Transport = () => {
    const { toggleDrawer } = useDrawer();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                        <View>
                            <Text style={styles.headingText}>Transport</Text>
                            <Text
                                style={styles.mainSubHeaddingText}
                                numberOfLines={1}
                            >
                                Explore the rich culture of Bodoland
                            </Text>
                        </View>
                    </View>
                </View>
                <FlashList
                    data={cuisineData}
                    renderItem={({ item, index }) => (
                        <CuisineCard
                            item={item}
                            index={index}
                            width={width}
                            height={height}
                        />
                    )}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    keyExtractor={(item) => item.identifier}
                    contentContainerStyle={{}}
                />
            </View>
        </View>
    );
};

export default Transport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
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
