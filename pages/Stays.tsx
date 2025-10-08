import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import React, { useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import StaysCard from "@/components/UI/ItemCards/StaysCard";
import CardLoader from "@/components/UI/ItemCards/CardLoader";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/UI/PageHeader/Header";

const { width, height } = Dimensions.get("screen");

const Stays = () => {
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
        queryKey: ["stays"],
        route: "stays",
        initialPageParam: 1,
        staleTime: 30 * 60 * 1000,
        limit: 10,
        expectedFields: [
            "identifier",
            "name",
            "image",
            "image_carousel",
            "location",
            "rating",
            "price",
            "original_price",
            "discount_percentage",
            "amenities",
            "short_description",
            "long_description",
        ],
        storeToUpdate: "stays",
    });

    const staysData = useMemo(() => {
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
                headingText="Stays"
                subHeadingText="Find your perfect accommodation"
            />
            {error ? (
                // Display error state
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Failed to load stays data
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
                    data={isLoading ? Array(10).fill(0) : staysData}
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
                        //We are sure it will have it everytime as we are ensuring the fields in the query itself thats why we have any
                        return (
                            <StaysCard
                                item={item as any}
                                index={index}
                                width={width}
                                height={height}
                            />
                        );
                    }}
                    getItemType={(item, index) => {
                        return isLoading ? "loader" : "stay";
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

export default Stays;

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
    loaderFooter: {
        paddingVertical: 20,
        alignItems: "center",
    },
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
});
