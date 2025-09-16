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
import FestivalsCard from "@/components/FestivalsCard";
import MenuButton from "@/components/UI/MenuButton";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import CardLoader from "@/components/CardLoader";

const { width, height } = Dimensions.get("window");

const Festivals = () => {
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
        queryKey: ["festivals"],
        route: "festivals",
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
        storeToUpdate: "festivals",
    });

    const festivalsData = useMemo(() => {
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
                            <Text style={styles.headingText}>Festivals</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Celebrate with the locals
                            </Text>
                        </View>
                    </View>
                </View>
                {error ? (
                    // Display error state
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Failed to load festivals data
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
                        data={isLoading ? Array(10).fill(0) : festivalsData}
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
                                <FestivalsCard
                                    item={item as any}
                                    index={index}
                                />
                            );
                        }}
                        getItemType={(item, index) => {
                            return isLoading ? "loader" : "festival";
                        }}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        estimatedItemSize={300}
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

export default Festivals;

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
