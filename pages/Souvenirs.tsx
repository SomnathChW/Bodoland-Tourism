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
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import ProductCard from "@/components/ProductCard";
import DynamicSortFilterComponent from "@/components/UI/Header/DynamicSortFilterComponent";
import MenuButton from "@/components/UI/MenuButton";
import { useSortFilter } from "@/hooks/useSortFilter";
import { souvenirsSortAndFilter } from "@/utils/sortFilterConfigs";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import CardLoader from "@/components/CardLoader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const Souvenirs = () => {
    const { toggleDrawer } = useDrawer();
    const insets = useSafeAreaInsets();
    const router = useRouter();
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
        queryKey: ["souvenirs"],
        route: "souvenirs",
        initialPageParam: 1,
        staleTime: 30 * 60 * 1000,
        limit: 10,
        expectedFields: [
            "identifier",
            "name",
            "image",
            "short_description",
            "price",
            "original_price",
            "discount_percentage",
            "rating",
            "in_stock",
            "categories",
        ],
        storeToUpdate: "souvenirs",
    });

    const souvenirData = useMemo(() => {
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
        data: souvenirData,
        sortOptions: souvenirsSortAndFilter.sortOptions,
        filterOptions: souvenirsSortAndFilter.filterOptions,
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

    const handleCartPress = () => {
        router.navigate({
            pathname: "/(protected)/cart",
        });
    };

    const handleOrdersPress = () => {
        router.navigate({
            pathname: "/(protected)/orders",
        });
    };

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
                        <View style={styles.textContainer}>
                            <Text style={styles.headingText}>Souvenirs</Text>
                            <Text
                                style={styles.mainSubHeaddingText}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                Take a piece of Bodoland with you
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.orderButton}
                            onPress={handleOrdersPress}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name="shopping-bag"
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={handleCartPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="cart" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
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

                {error ? (
                    // Display error state
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Failed to load souvenirs
                        </Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => refetch()}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Single FlashList for both loading and data states
                    <FlashList
                        data={
                            isLoading ? Array(6).fill(0) : sortedAndFilteredData
                        }
                        renderItem={({ item, index }) => {
                            if (isLoading) {
                                return (
                                    <CardLoader
                                        index={index}
                                        width={width}
                                        height={height}
                                    />
                                );
                            }
                            return (
                                <ProductCard
                                    item={item}
                                    index={index}
                                    width={width}
                                    height={height}
                                />
                            );
                        }}
                        getItemType={(item, index) => {
                            return isLoading ? "loader" : "product";
                        }}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        keyExtractor={(item, index) =>
                            isLoading ? `loader-${index}` : item.identifier
                        }
                        contentContainerStyle={{}}
                        removeClippedSubviews={true}
                        onEndReached={isLoading ? undefined : handleLoadMore}
                        onEndReachedThreshold={0.7}
                        ListFooterComponent={
                            isLoading ? undefined : renderFooter
                        }
                    />
                )}
            </View>
        </View>
    );
};

export default Souvenirs;

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
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    buttons: {
        color: "#fff",
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    orderButton: {
        padding: 8,
    },
    cartButton: {
        padding: 8,
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
    errorContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
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
