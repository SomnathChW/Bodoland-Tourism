import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import ProductCard from "@/components/UI/ItemCards/ProductCard";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import CardLoader from "@/components/UI/ItemCards/CardLoader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/UI/PageHeader/Header";

const { width, height } = Dimensions.get("window");

const Souvenirs = () => {
    const insets = useSafeAreaInsets();

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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                headingText="Souvenirs"
                subHeadingText="Take a piece of BTR home"
                souvenir
            />

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
                    data={isLoading ? Array(6).fill(0) : souvenirData}
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
                    ListFooterComponent={isLoading ? undefined : renderFooter}
                />
            )}
        </View>
    );
};

export default Souvenirs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
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
