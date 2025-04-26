import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
    FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import StaysCard from "@/components/StaysCard";
import CardLoader from "@/components/CardLoader";
import { staysData } from "@/data/stays_data";

const { width, height } = Dimensions.get("window");

const Stays = React.memo(() => {
    const { toggleDrawer } = useDrawer();
    const [loading, setLoading] = useState(true);

    // Create array of 6 placeholder items
    const loaderItems = Array(10)
        .fill(null)
        .map((_, i) => ({ id: `loader-${i}` }));

    useEffect(() => {
        // Simulate loading for 1000ms
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

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
                            <Text style={styles.headingText}>Stays</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Find your perfect accommodation
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>

                {loading ? (
                    <FlatList
                        data={loaderItems}
                        renderItem={({ index }) => (
                            <CardLoader
                                index={index}
                                width={width}
                                height={height}
                            />
                        )}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <FlashList
                        data={staysData}
                        renderItem={({ item, index }) => (
                            <StaysCard
                                item={item}
                                index={index}
                                width={width}
                                height={height}
                            />
                        )}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        estimatedItemSize={height * 0.25}
                        keyExtractor={(item) => item.identifier}
                        contentContainerStyle={{}}
                        removeClippedSubviews={true}
                    />
                )}
            </View>
        </View>
    );
});

export default Stays;

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
