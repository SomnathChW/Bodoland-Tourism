import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import React, { useMemo } from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import CuisineCard from "@/components/CuisineCard";
import MenuButton from "@/components/UI/MenuButton";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import CardLoader from "@/components/CardLoader";

const { width, height } = Dimensions.get("window");

const Cuisine = () => {
    const { toggleDrawer } = useDrawer();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        refetch,
    } = useAppwriteInfiniteQuery({
        queryKey: ["cuisine"],
        route: "cuisine",
        initialPageParam: 1,
        staleTime: 30 * 60 * 1000,
        limit: 10,
        expectedFields: [
            "identifier",
            "name",
            "image",
            "image_carousel",
            "short_description",
            "long_description",
        ],
        storeToUpdate: "cuisine",
    });

    const cuisineData = useMemo(() => {
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
                            <Text style={styles.headingText}>Cuisine</Text>
                            <Text
                                style={styles.mainSubHeaddingText}
                                numberOfLines={1}
                            >
                                Explore the rich culture of Bodoland
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>

                {isLoading ? (
                    // Display loading skeleton while data is loading
                    <FlashList
                        data={Array(10).fill(0)}
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
                            Failed to load cuisine data
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
                        data={cuisineData}
                        renderItem={({ item, index }) => {
                            //We are sure it will have it everytime as we are ensuring the fields in the query itself thats why we have any
                            return (
                                <CuisineCard item={item as any} index={index} />
                            );
                        }}
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

export default Cuisine;

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
