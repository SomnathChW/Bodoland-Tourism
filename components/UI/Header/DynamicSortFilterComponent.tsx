import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SortOption, FilterOption } from "@/hooks/useSortFilter";

type DynamicSortFilterComponentProps = {
    sortOptions: SortOption[];
    filterOptions?: FilterOption[];
    activeSortId: string;
    setActiveSortId: (sortId: string) => void;
    activeFilters: Record<string, any>;
    setActiveFilters: (filters: Record<string, any>) => void;
    sortModalVisible: boolean;
    setSortModalVisible: (visible: boolean) => void;
    filterModalVisible: boolean;
    setFilterModalVisible: (visible: boolean) => void;
    resetFilters: () => void;
};

const DynamicSortFilterComponent = ({
    sortOptions,
    filterOptions = [],
    activeSortId,
    setActiveSortId,
    activeFilters,
    setActiveFilters,
    sortModalVisible,
    setSortModalVisible,
    filterModalVisible,
    setFilterModalVisible,
    resetFilters,
}: DynamicSortFilterComponentProps) => {
    const hasActiveFilters = Object.values(activeFilters).some(
        (value) =>
            value !== undefined &&
            value !== null &&
            value !== "all" &&
            (Array.isArray(value) ? value.length > 0 : true)
    );

    const handleFilterChange = (filterId: string, value: any) => {
        setActiveFilters({
            ...activeFilters,
            [filterId]: activeFilters[filterId] === value ? "all" : value,
        });
    };

    return (
        <>
            {/* Filter and Sort section */}
            <View style={styles.filterSortContainer}>
                {filterOptions.length > 0 && (
                    <>
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                hasActiveFilters && styles.activeButton,
                            ]}
                            onPress={() => setFilterModalVisible(true)}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="options-outline"
                                size={18}
                                color="#fff"
                            />
                            <Text
                                style={[
                                    styles.filterSortText,
                                    hasActiveFilters && styles.activeButtonText,
                                ]}
                            >
                                Filters
                            </Text>
                            {hasActiveFilters && (
                                <View style={styles.filterBadge}>
                                    <Text style={styles.filterBadgeText}>
                                        {
                                            Object.values(activeFilters).filter(
                                                (v) =>
                                                    v !== undefined &&
                                                    v !== null &&
                                                    v !== "all" &&
                                                    (Array.isArray(v)
                                                        ? v.length > 0
                                                        : true)
                                            ).length
                                        }
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider} />
                    </>
                )}

                <TouchableOpacity
                    style={[
                        styles.sortButton,
                        activeSortId !== "default" && styles.activeButton,
                    ]}
                    onPress={() => setSortModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="swap-vertical-outline"
                        size={18}
                        color={activeSortId !== "default" ? "#fff" : "#fff"}
                    />
                    <Text
                        style={[
                            styles.filterSortText,
                            activeSortId !== "default" &&
                                styles.activeButtonText,
                        ]}
                    >
                        Sort
                    </Text>
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

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Default option */}
                            <TouchableOpacity
                                style={styles.sortOption}
                                onPress={() => {
                                    setActiveSortId("default");
                                    setSortModalVisible(false);
                                }}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        activeSortId === "default" &&
                                            styles.activeSortOptionText,
                                    ]}
                                >
                                    Default
                                </Text>
                                {activeSortId === "default" && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#fff"
                                    />
                                )}
                            </TouchableOpacity>

                            {/* Dynamic sort options */}
                            {sortOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={styles.sortOption}
                                    onPress={() => {
                                        setActiveSortId(option.id);
                                        setSortModalVisible(false);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.sortOptionText,
                                            activeSortId === option.id &&
                                                styles.activeSortOptionText,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {activeSortId === option.id && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            color="#fff"
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Filter Modal */}
            {filterOptions.length > 0 && (
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
                            style={[
                                styles.modalContent,
                                styles.filterModalContent,
                            ]}
                            onStartShouldSetResponder={() => true}
                            onTouchEnd={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <View style={styles.modalHandle} />

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Filters</Text>
                                <View style={styles.filterActions}>
                                    {hasActiveFilters && (
                                        <TouchableOpacity
                                            onPress={resetFilters}
                                            activeOpacity={0.8}
                                            style={styles.resetButton}
                                        >
                                            <Text
                                                style={styles.resetButtonText}
                                            >
                                                Reset
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        onPress={() =>
                                            setFilterModalVisible(false)
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={24}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {filterOptions.map((filter) => (
                                    <View
                                        key={filter.id}
                                        style={styles.filterSection}
                                    >
                                        <Text style={styles.filterSectionTitle}>
                                            {filter.label}
                                        </Text>

                                        {filter.type === "select" &&
                                            filter.options && (
                                                <View
                                                    style={
                                                        styles.filterChipsContainer
                                                    }
                                                >
                                                    {filter.options.map(
                                                        (option) => (
                                                            <TouchableOpacity
                                                                key={
                                                                    option.value
                                                                }
                                                                style={[
                                                                    styles.filterChip,
                                                                    activeFilters[
                                                                        filter
                                                                            .id
                                                                    ] ===
                                                                        option.value &&
                                                                        styles.activeFilterChip,
                                                                ]}
                                                                onPress={() =>
                                                                    handleFilterChange(
                                                                        filter.id,
                                                                        option.value
                                                                    )
                                                                }
                                                                activeOpacity={
                                                                    0.8
                                                                }
                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.filterChipText,
                                                                        activeFilters[
                                                                            filter
                                                                                .id
                                                                        ] ===
                                                                            option.value &&
                                                                            styles.activeFilterChipText,
                                                                    ]}
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    )}
                                                </View>
                                            )}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </>
    );
};

export default DynamicSortFilterComponent;

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
        gap: 6,
    },
    sortButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    activeButton: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    activeButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    filterBadge: {
        backgroundColor: "#fff",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },
    filterBadgeText: {
        color: "#000",
        fontSize: 12,
        fontWeight: "600",
    },

    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
    },
    modalContent: {
        backgroundColor: "#1e252e",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        paddingTop: 10,
        maxHeight: "70%",
    },
    filterModalContent: {
        maxHeight: "80%",
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
    filterActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    resetButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 6,
    },
    resetButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
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
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 16,
        fontFamily: "SfProMedium",
    },
    activeSortOptionText: {
        color: "#fff",
        fontWeight: "600",
    },

    // Filter specific styles
    filterSection: {
        marginBottom: 24,
    },
    filterSectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        fontFamily: "SfProMedium",
    },
    filterChipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(100, 111, 126, 0.3)",
    },
    activeFilterChip: {
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    filterChipText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 14,
        fontFamily: "SfProMedium",
        textAlign: "center",
    },
    activeFilterChipText: {
        color: "#000",
        fontWeight: "600",
    },
});
