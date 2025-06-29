import { Text, View, StyleSheet, StatusBar } from "react-native";
import React from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AttractionsCard from "@/components/AttractionsCard";
import DynamicSortFilterComponent from "@/components/UI/Header/DynamicSortFilterComponent";
import { attractionsData } from "@/data/attractions_data";
import { useSortFilter } from "@/hooks/useSortFilter";
import { attractionsSortAndFilter } from "@/utils/sortFilterConfigs";

const Attractions = () => {
    const { toggleDrawer } = useDrawer();
    const showSortFilter = true; // Set to true if you want to show sort/filter options

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
        data: attractionsData,
        sortOptions: attractionsSortAndFilter.sortOptions,
        filterOptions: attractionsSortAndFilter.filterOptions,
    });

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
                {showSortFilter && (
                    <DynamicSortFilterComponent
                        sortOptions={attractionsSortAndFilter.sortOptions}
                        filterOptions={attractionsSortAndFilter.filterOptions}
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
