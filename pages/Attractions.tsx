import {
    Text,
    View,
    StyleSheet,
    StatusBar,
} from "react-native";
import React, { useState, useMemo } from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AttractionsCard from "@/components/AttractionsCard";
import SortFilterComponent from "@/components/UI/Header/SortFilterComponent";
import { attractionsData } from "@/data/attractions_data";

const Attractions = () => {
    const { toggleDrawer } = useDrawer();

    // State for price sorting
    const [priceSortOrder, setPriceSortOrder] = useState(0); // 0: none, 1: low-high, 2: high-low

    // State for modals
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    // Filter and sort data based on active filters
    const filteredData = useMemo(() => {
        let result = [...attractionsData];

        // Apply price sorting if active
        if (priceSortOrder === 1) {
            result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        } else if (priceSortOrder === 2) {
            result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        }

        return result;
    }, [priceSortOrder]);

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
                            <Text style={styles.headingText}>Attractions</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Discover exciting places to visit
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>

                {/* Sorting and Filtering Component */}
                <SortFilterComponent
                    priceSortOrder={priceSortOrder}
                    setPriceSortOrder={setPriceSortOrder}
                    sortModalVisible={sortModalVisible}
                    setSortModalVisible={setSortModalVisible}
                    filterModalVisible={filterModalVisible}
                    setFilterModalVisible={setFilterModalVisible}
                />

                <FlashList
                    data={filteredData}
                    renderItem={({ item, index }) => (
                        <AttractionsCard item={item} index={index} />
                    )}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    estimatedItemSize={300}
                    keyExtractor={(item) => item.identifier}
                    contentContainerStyle={{}}
                />
            </View>
        </View>
    );
};

export default Attractions;

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
