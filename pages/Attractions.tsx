import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useMemo } from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AttractionsCard from "@/components/AttractionsCard";
import DynamicSortFilterComponent from "@/components/UI/Header/DynamicSortFilterComponent";
import MenuButton from "@/components/UI/MenuButton";
import { useSortFilter } from "@/hooks/useSortFilter";
import { attractionsSortAndFilter } from "@/utils/sortFilterConfigs";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import CardLoader from "@/components/CardLoader";

const { width, height } = Dimensions.get("window");

const Attractions = () => {
    const { toggleDrawer } = useDrawer();
    const showSortFilter = false; // Set to true if you want to show sort/filter options

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        refetch,
    } = useAppwriteInfiniteQuery({
        queryKey: ["attractions"],
        route: "attractions",
        initialPageParam: 1,
        staleTime: 30 * 60 * 1000,
        limit: 10,
        expectedFields: [
            "identifier",
            "name",
            "image",
            "location",
            "price",
            "short_description",
            "district",
        ],
        storeToUpdate: "attractions",
    });

    const attractionsData = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) || [];
    }, [data]);

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

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color="#646f7e" />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

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
                            <Text style={styles.headingText}>Attractions</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Discover exciting places to visit
                            </Text>
                        </View>
                    </View>
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

                {isLoading ? (
                    // Display loading skeleton while data is loading
                    <FlashList
                        data={Array(6).fill(0)}
                        renderItem={({ index }) => (
                            <CardLoader
                                index={index}
                                width={width}
                                height={height}
                            />
                        )}
                        keyExtractor={(_, index: number) => `loader-${index}`}
                        numColumns={2}
                        estimatedItemSize={300}
                    />
                ) : error ? (
                    // Display error state
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Failed to load attractions
                        </Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => refetch()}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Display loaded data
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
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.7}
                        ListFooterComponent={renderFooter}
                    />
                )}
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
    // New styles for Appwrite integration
    errorContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        borderRadius: 10,
        margin: 20,
        flex: 1,
    },
    errorText: {
        color: "#ff6b6b",
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#4b88a2",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    loaderFooter: {
        paddingVertical: 20,
        alignItems: "center",
    },
});
