import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import AttractionsCard from "@/components/UI/ItemCards/AttractionsCard";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import CardLoader from "@/components/UI/ItemCards/CardLoader";
import Header from "@/components/UI/PageHeader/Header";

const { width, height } = Dimensions.get("screen");

const Attractions = () => {
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
                headingText="Attractions"
                subHeadingText="Discover exciting places to visit"
            />

            {error ? (
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
                // Single FlashList for both loading and data states
                <FlashList
                    data={isLoading ? Array(6).fill(0) : attractionsData}
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
                            <AttractionsCard
                                item={item}
                                index={index}
                                width={width}
                                height={height}
                            />
                        );
                    }}
                    getItemType={(item, index) => {
                        return isLoading ? "loader" : "attraction";
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
                    scrollEnabled={!isLoading}
                />
            )}
        </View>
    );
};

export default Attractions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
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
