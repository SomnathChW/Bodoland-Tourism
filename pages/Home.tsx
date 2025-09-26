import { Text, View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Section from "@/components/UI/Section/Section";
import QuickLinks from "@/components/UI/QuickLinks/QuickLinksSection";
import MenuButton from "@/components/UI/MenuButton";
import CardVertical from "@/components/UI/Section/CardVertical";
import CardHorizontal from "@/components/UI/Section/CardHorizontal";
import Carousel from "@/components/UI/Carousel/Carousel";
import CategoryCard from "@/components/UI/QuickLinks/CategoryCard";

import { categoryData } from "@/data/category_data";
import { useDrawer } from "@/context/DrawerContext";
import { useHomePageData } from "@/hooks/useHomePageData";

type HomeItemTypes =
    | {
          type: "carousel";
          id: string;
          data: any[];
      }
    | {
          type: "quicklinks";
          id: string;
          data: typeof categoryData;
          cardComponent: typeof CategoryCard;
          itemsPerRow: number;
      }
    | {
          type: "section";
          id: string;
          subHeading: string;
          data: any[];
          cardComponent: typeof CardVertical | typeof CardHorizontal;
          viewAll?: () => void;
      }
    | {
          type: "end";
          id: "end";
      };

const Home = () => {
    const { toggleDrawer } = useDrawer();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const {
        data: homePageResponse,
        isLoading: homePageLoading,
        error: homePageError,
    } = useHomePageData({
        attractionsLimit: 5,
        souvenirsLimit: 5,
        virtualToursLimit: 5,
        featuredLimit: 20,
        festivalsLimit: 5,
        cuisinesLimit: 5,
        districtsLimit: 5,
    });

    // Extract data from the response
    const attractionsData = homePageResponse?.data?.attractions?.items || [];
    const souvenirsData = homePageResponse?.data?.souvenirs?.items || [];
    const virtualToursData = homePageResponse?.data?.virtual_tours?.items || [];
    const featuredData = homePageResponse?.data?.featured?.items || [];
    const festivalsData = homePageResponse?.data?.festivals?.items || [];
    const cuisinesData = homePageResponse?.data?.cuisines?.items || [];
    const districtData = homePageResponse?.data?.districts?.items || [];

    const HomeItemsList: HomeItemTypes[] = [
        {
            type: "carousel",
            id: "carousel",
            data: featuredData,
        },
        {
            type: "quicklinks",
            id: "quicklinks",
            data: categoryData,
            cardComponent: CategoryCard,
            itemsPerRow: 5,
        },
        {
            type: "section",
            id: "districts",
            subHeading: "Districts",
            data: districtData,
            cardComponent: CardVertical,
        },
        {
            type: "section",
            id: "virtual_tours",
            subHeading: "Virtual Tours",
            data: virtualToursData,
            cardComponent: CardHorizontal,
            viewAll: () => router.push("/virtual_tours"),
        },
        {
            type: "section",
            id: "festivals",
            subHeading: "Festivals",
            data: festivalsData,
            cardComponent: CardVertical,
            viewAll: () => router.push("/festivals"),
        },
        {
            type: "section",
            id: "cuisines",
            subHeading: "Cuisines",
            data: cuisinesData,
            cardComponent: CardHorizontal,
            viewAll: () => router.push("/cuisines"),
        },
        {
            type: "section",
            id: "souvenirs",
            subHeading: "Souvenirs",
            data: souvenirsData,
            cardComponent: CardVertical,
            viewAll: () => router.push("/souvenirs"),
        },
        {
            type: "section",
            id: "attractions",
            subHeading: "Attractions",
            data: attractionsData,
            cardComponent: CardHorizontal,
            viewAll: () => router.push("/attractions"),
        },
        {
            type: "end",
            id: "end",
        },
    ];

    const renderItem = useCallback(
        ({ item }: { item: HomeItemTypes }) => {
            switch (item.type) {
                case "carousel":
                    return (
                        <View style={{ paddingBottom: 10 }}>
                            <Carousel
                                data={homePageLoading ? [] : item.data}
                                isLoading={homePageLoading}
                            />
                        </View>
                    );
                case "quicklinks":
                    return (
                        <QuickLinks
                            data={item.data}
                            cardComponent={item.cardComponent}
                            itemsPerRow={item.itemsPerRow}
                        />
                    );
                case "section":
                    return (
                        <Section
                            subHeading={item.subHeading}
                            data={homePageLoading ? [] : item.data}
                            cardComponent={item.cardComponent}
                            viewAll={item.viewAll}
                            isLoading={homePageLoading}
                            loadingCardCount={3}
                            cardType={
                                item.cardComponent === CardHorizontal
                                    ? "horizontal"
                                    : "vertical"
                            }
                        />
                    );
                default:
                    return null;
            }
        },
        [homePageLoading]
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                {/* Header remains the same */}
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                        <View>
                            <Text style={styles.headingText}>
                                Bodoland Tourism
                            </Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Discover a land untouched
                            </Text>
                        </View>
                    </View>
                </View>

                {/* FlashList now includes the Carousel */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={HomeItemsList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContentContainer}
                        removeClippedSubviews={true}
                        windowSize={10}
                        maxToRenderPerBatch={3}
                        updateCellsBatchingPeriod={100}
                        initialNumToRender={3}
                        getItemLayout={(data, index) => ({
                            length: 300, // Approximate item height
                            offset: 300 * index,
                            index,
                        })}
                    />
                </View>
            </View>
        </View>
    );
};

export default Home;

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
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    listContentContainer: {
        // paddingBottom: 20,
        // paddingTop: 10,
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
    // Styles for Section component (remain unchanged)
    subHeaddingView: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 10,
    },
    subHeaddings: {
        fontFamily: "SfProMedium",
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    links: {
        fontFamily: "SfProMedium",
        fontSize: 16,
        color: "#646f7e",
        paddingTop: 5,
    },
});
