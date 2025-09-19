import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    FlatList,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import React, { useMemo } from "react";
import { useDrawer } from "@/context/DrawerContext";
import MenuButton from "@/components/UI/MenuButton";
import {
    EmergencyContact,
    universalEmergencyNumbers,
    UniversalEmergencyService,
} from "@/data/emergency_data";
import EmergencyCard from "@/components/EmergencyCard";
import UniversalEmergencyCard from "@/components/UniversalEmergencyCard";
import { useAppwriteInfiniteQuery } from "@/hooks/useAppwriteInfiniteQuery";
import CardLoader from "@/components/CardLoader";

const { width, height } = Dimensions.get("screen");

const Emergency = () => {
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
        queryKey: ["emergencyContacts"],
        route: "emergency_contacts",
        initialPageParam: 1,
        staleTime: 30 * 60 * 1000,
        limit: 10,
        expectedFields: [
            "identifier",
            "name",
            "image",
            "police",
            "fire",
            "ambulance",
            "extra_data",
        ],
        storeToUpdate: "emergency_contacts",
    });

    const emergencyContacts = useMemo(() => {
        return (
            (data?.pages.flatMap((page) => page.data) as EmergencyContact[]) ||
            []
        );
    }, [data]);

    const renderUniversalEmergencyCard = ({
        item,
        index,
    }: {
        item: UniversalEmergencyService;
        index: number;
    }) => <UniversalEmergencyCard item={item} index={index} />;

    const renderDistrictEmergencyCard = ({
        item,
        index,
    }: {
        item: EmergencyContact;
        index: number;
    }) => (
        <EmergencyCard
            item={item}
            index={index}
            width={width}
            height={height}
        />
    );

    const renderCardLoader = ({ index }: { index: number }) => (
        <CardLoader index={index} width={width} height={height} />
    );

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color="#646f7e" />
            </View>
        );
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
                            <Text style={styles.headingText}>
                                Emergency Contacts
                            </Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Important contact information
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {/* Universal Emergency Numbers Section */}
                    <View style={styles.sectionContainer}>
                        <FlatList
                            key="loader"
                            data={universalEmergencyNumbers}
                            renderItem={renderUniversalEmergencyCard}
                            keyExtractor={(item) => item.number}
                            numColumns={2}
                            scrollEnabled={false}
                            contentContainerStyle={styles.universalGrid}
                            columnWrapperStyle={styles.columnWrapper}
                        />
                    </View>

                    {/* District-wise Emergency Contacts Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>
                            District-wise Emergency Contacts
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            Local emergency services in BTR districts
                        </Text>

                        {error ? (
                            // Display error state
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>
                                    Failed to load emergency contacts
                                </Text>
                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={() => refetch()}
                                >
                                    <Text style={styles.retryButtonText}>
                                        Retry
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // Single FlatList for both loading and data states
                            <FlatList
                                data={
                                    isLoading
                                        ? Array(6).fill(0)
                                        : emergencyContacts
                                }
                                renderItem={({ item, index }) => {
                                    if (isLoading) {
                                        return renderCardLoader({ index });
                                    }
                                    return renderDistrictEmergencyCard({
                                        item,
                                        index,
                                    });
                                }}
                                keyExtractor={(item, index) =>
                                    isLoading
                                        ? `loader-${index}`
                                        : item.identifier
                                }
                                numColumns={2}
                                scrollEnabled={false}
                                contentContainerStyle={styles.districtGrid}
                                ListFooterComponent={
                                    isLoading ? undefined : renderFooter
                                }
                                onEndReached={
                                    isLoading ? undefined : handleLoadMore
                                }
                                onEndReachedThreshold={0.5}
                                columnWrapperStyle={styles.columnWrapper}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Emergency;

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
    buttons: {
        color: "#fff",
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    sectionContainer: {
        marginTop: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "SfProMedium",
        marginBottom: 4,
        paddingHorizontal: 15,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#646f7e",
        fontFamily: "SfProMedium",
        marginBottom: 16,
        paddingHorizontal: 15,
    },
    universalGrid: {
        paddingHorizontal: 0,
    },
    districtGrid: {
        paddingHorizontal: 0,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    loaderFooter: {
        paddingVertical: 20,
        alignItems: "center",
    },
    errorContainer: {
        padding: 20,
        alignItems: "center",
    },
    errorText: {
        color: "#ff6b6b",
        marginBottom: 10,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
});
