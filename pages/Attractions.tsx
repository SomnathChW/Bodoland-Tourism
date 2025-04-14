import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Modal,
} from "react-native";
import React, { useState, useMemo } from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AttractionsCard from "@/components/AttractionsCard";
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

    // Get price sort label
    const getPriceSortLabel = () => {
        switch (priceSortOrder) {
            case 0:
                return "Default";
            case 1:
                return "Price: Low to High";
            case 2:
                return "Price: High to Low";
            default:
                return "Default";
        }
    };

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

                {/* Filter and Sort section */}
                <View style={styles.filterSortContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFilterModalVisible(true)}
                        activeOpacity={0.8} // Subtle feedback on press
                    >
                        <Ionicons
                            name="options-outline"
                            size={18}
                            color="#fff"
                        />
                        <Text style={styles.filterSortText}>Filters</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={() => setSortModalVisible(true)}
                        activeOpacity={0.8} // Subtle feedback on press
                    >
                        <Ionicons
                            name="swap-vertical-outline"
                            size={18}
                            color="#fff"
                        />
                        <Text style={styles.filterSortText}>Sort</Text>
                    </TouchableOpacity>
                </View>

                <FlashList
                    data={filteredData}
                    renderItem={({ item, index }) => (
                        <AttractionsCard item={item} index={index} />
                    )}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    estimatedItemSize={30}
                    keyExtractor={(item) => item.identifier}
                    contentContainerStyle={{}}
                />

                {/* Sort Modal - with slower animation and dismissible by tapping overlay */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={sortModalVisible}
                    onRequestClose={() => setSortModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPress={() => setSortModalVisible(false)}
                    >
                        <View
                            style={styles.modalContent}
                            onStartShouldSetResponder={() => true}
                            onTouchEnd={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <View style={styles.modalHandle} />

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Sort By</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.sortOption}
                                onPress={() => {
                                    setPriceSortOrder(0);
                                    setSortModalVisible(false);
                                }}
                                activeOpacity={0.8} // Subtle feedback on press
                            >
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        priceSortOrder === 0 &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Default
                                </Text>
                                {priceSortOrder === 0 && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#fff"
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.sortOption}
                                onPress={() => {
                                    setPriceSortOrder(1);
                                    setSortModalVisible(false);
                                }}
                                activeOpacity={0.8} // Subtle feedback on press
                            >
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        priceSortOrder === 1 &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Price: Low to High
                                </Text>
                                {priceSortOrder === 1 && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#fff"
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.sortOption}
                                onPress={() => {
                                    setPriceSortOrder(2);
                                    setSortModalVisible(false);
                                }}
                                activeOpacity={0.8} // Subtle feedback on press
                            >
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        priceSortOrder === 2 &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Price: High to Low
                                </Text>
                                {priceSortOrder === 2 && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#fff"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Filter Modal placeholder - for future implementation */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={filterModalVisible}
                    onRequestClose={() => setFilterModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPress={() => setFilterModalVisible(false)}
                    >
                        <View
                            style={styles.modalContent}
                            onStartShouldSetResponder={() => true}
                            onTouchEnd={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <View style={styles.modalHandle} />

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Filters</Text>
                                <TouchableOpacity
                                    onPress={() => setFilterModalVisible(false)}
                                    activeOpacity={0.8} // Subtle feedback on press
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.sortOptionText}>
                                Filter options coming soon...
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Modal>
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
    // Filter/sort styles
    filterSortContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 15,
        backgroundColor: "#1e252e",
        borderRadius: 8,
        overflow: "hidden",
        height: 40,
    },
    filterButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    sortButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    divider: {
        width: 1,
        backgroundColor: "#646f7e",
        opacity: 0.3,
    },
    filterSortText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "transparent", // No visible overlay
    },
    modalContent: {
        backgroundColor: "#1e252e",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        paddingTop: 10,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "#646f7e",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 15,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    modalTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "SfProMedium",
    },
    sortOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(100, 111, 126, 0.2)",
    },
    sortOptionText: {
        color: "rgba(255, 255, 255, 0.51)",
        fontSize: 16,
        fontFamily: "SfProMedium",
    },
    activeSortOptionText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
