import { Text, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Ionicons } from "@expo/vector-icons";

type SortFilterComponentProps = {
    priceSortOrder: number;
    setPriceSortOrder: Dispatch<SetStateAction<number>>;
    sortModalVisible: boolean;
    setSortModalVisible: Dispatch<SetStateAction<boolean>>;
    filterModalVisible: boolean;
    setFilterModalVisible: Dispatch<SetStateAction<boolean>>;
};

const SortFilterComponent = ({
    priceSortOrder,
    setPriceSortOrder,
    sortModalVisible,
    setSortModalVisible,
    filterModalVisible,
    setFilterModalVisible,
}: SortFilterComponentProps) => {
    return (
        <>
            {/* Filter and Sort section */}
            <View style={styles.filterSortContainer}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="options-outline" size={18} color="#fff" />
                    <Text style={styles.filterSortText}>Filters</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="swap-vertical-outline"
                        size={18}
                        color="#fff"
                    />
                    <Text style={styles.filterSortText}>Sort</Text>
                </TouchableOpacity>
            </View>

            {/* Sort Modal */}
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
                            activeOpacity={0.8}
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
                            activeOpacity={0.8}
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
                            activeOpacity={0.8}
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

            {/* Filter Modal placeholder */}
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
                                activeOpacity={0.8}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sortOptionText}>
                            Filter options coming soon...
                        </Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default SortFilterComponent;

const styles = StyleSheet.create({
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
