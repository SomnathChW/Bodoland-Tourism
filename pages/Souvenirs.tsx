import { StyleSheet, StatusBar, View, Text, ScrollView } from "react-native";
import React from "react";

import { souvenirData } from "@/data/souvenir_data";
import ProductCard from "@/components/ProductCard";
import DynamicSortFilterComponent from "@/components/UI/Header/DynamicSortFilterComponent";
import MenuButton from "@/components/UI/MenuButton";

import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useDrawer } from "@/context/DrawerContext";
import { useSortFilter } from "@/hooks/useSortFilter";
import { souvenirsSortAndFilter } from "@/utils/sortFilterConfigs";

const Souvenirs = () => {
    const { toggleDrawer } = useDrawer();

    const showSortFilter = false;

    const {
        sortedAndFilteredData,
        activeSortId,
        setActiveSortId,
        activeFilters,
        setActiveFilters,
        sortModalVisible,
        setSortModalVisible,
        filterModalVisible,
        setFilterModalVisible,
        resetFilters,
    } = useSortFilter({
        data: souvenirData,
        sortOptions: souvenirsSortAndFilter.sortOptions,
        filterOptions: souvenirsSortAndFilter.filterOptions,
    });
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                        <View>
                            <Text style={styles.headingText}>Souvenirs</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Take a piece of Bodoland with you
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>

                {/* Sorting and Filtering Component */}
                {showSortFilter && (
                    <DynamicSortFilterComponent
                        sortOptions={souvenirsSortAndFilter.sortOptions}
                        filterOptions={souvenirsSortAndFilter.filterOptions}
                        activeSortId={activeSortId}
                        setActiveSortId={setActiveSortId}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        sortModalVisible={sortModalVisible}
                        setSortModalVisible={setSortModalVisible}
                        filterModalVisible={filterModalVisible}
                        setFilterModalVisible={setFilterModalVisible}
                        resetFilters={resetFilters}
                    />
                )}

                <FlashList
                    data={sortedAndFilteredData}
                    renderItem={({ item, index }) => (
                        <ProductCard item={item} index={index} />
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

export default Souvenirs;

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
