import { Text, View, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { useDrawer } from "@/context/DrawerContext";
import { FlashList } from "@shopify/flash-list";
import StaysCard from "@/components/StaysCard";
import CardLoader from "@/components/CardLoader";
import MenuButton from "@/components/UI/PageHeader/MenuButton";
import { staysData } from "@/data/stays_data";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("screen");

const Stays = React.memo(() => {
    const { toggleDrawer } = useDrawer();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for 1500ms
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

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
                            <Text style={styles.headingText}>Stays</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Find your perfect accommodation
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Single FlashList for both loading and data states */}
                <FlashList
                    data={loading ? Array(6).fill(0) : staysData}
                    renderItem={({ item, index }) => {
                        if (loading) {
                            return (
                                <CardLoader
                                    index={index}
                                    width={width}
                                    height={height}
                                />
                            );
                        }
                        return (
                            <StaysCard
                                item={item}
                                index={index}
                                width={width}
                                height={height}
                            />
                        );
                    }}
                    getItemType={(item, index) => {
                        return loading ? "loader" : "stay";
                    }}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    keyExtractor={(item, index) =>
                        loading ? `loader-${index}` : item.identifier
                    }
                    contentContainerStyle={{}}
                    removeClippedSubviews={true}
                />
            </View>
        </View>
    );
});

export default Stays;

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
