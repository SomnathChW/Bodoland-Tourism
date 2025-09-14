import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    Platform,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import Section from "@/components/UI/Section/Section";
import QuickLinks from "@/components/UI/QuickLinks/QuickLinksSection";
import MenuButton from "@/components/UI/MenuButton";
import CardVertical from "@/components/UI/Section/CardVertical";
import CardHorizontal from "@/components/UI/Section/CardHorizontal";
import Carousel from "@/components/UI/Carousel/Carousel";
import CategoryCard from "@/components/UI/QuickLinks/CategoryCard";

import { districtData } from "@/data/district_data";
import { categoryData } from "@/data/category_data";
import { useDrawer } from "@/context/DrawerContext";
import { useAppwriteQuery } from "@/hooks/useAppwriteQuery";

type ListItem =
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
    const router = useRouter();
    const { toggleDrawer } = useDrawer();

    // Fetch attractions data from Appwrite
    const {
        data: attractionsResponse,
        isLoading: attractionsLoading,
        error: attractionsError,
    } = useAppwriteQuery({
        queryKey: ["attractions", "homepage"],
        route: "attractions",
        limit: 5,
        expectedFields: [
            "identifier",
            "name",
            "image",
            "location",
            "price",
            "short_description",
            "district",
        ],
        staleTime: 30 * 60 * 1000, // 30 minutes
    });

    const attractionsData = attractionsResponse?.data || [];

    // Fetch souvenirs data from Appwrite
    const {
        data: souvenirsResponse,
        isLoading: souvenirsLoading,
        error: souvenirsError,
    } = useAppwriteQuery({
        queryKey: ["souvenirs", "homepage"],
        route: "souvenirs",
        limit: 5,
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
        staleTime: 30 * 60 * 1000, // 30 minutes
    });

    const souvenirsData = souvenirsResponse?.data || [];

    // Fetch Virtual Tours data from Appwrite
    const {
        data: virtualToursResponse,
        isLoading: virtualToursLoading,
        error: virtualToursError,
    } = useAppwriteQuery({
        queryKey: ["virtual_tours", "homepage"],
        route: "virtual_tours",
        limit: 5,
        expectedFields: [
            "identifier",
            "name",
            "image",
            "location",
            "tour_resource",
        ],
        staleTime: 30 * 60 * 1000, // 30 minutes
    });

    const virtualToursData = virtualToursResponse?.data || [];

    // Fetch Featured/Carousel data from Appwrite
    const {
        data: featuredResponse,
        isLoading: featuredLoading,
        error: featuredError,
    } = useAppwriteQuery({
        queryKey: ["featured", "homepage"],
        route: "featured",
        limit: 20,
        expectedFields: ["identifier", "title", "image", "description", "type"],
        staleTime: 30 * 60 * 1000, // 30 minutes
    });

    const featuredData = featuredResponse?.data || [];

    const listData: ListItem[] = [
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

    const renderItem = ({ item }: { item: ListItem }) => {
        switch (item.type) {
            case "carousel":
                return (
                    <View style={{ paddingBottom: 10 }}>
                        <Carousel
                            data={featuredLoading ? [] : item.data}
                            isLoading={featuredLoading}
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
                // Special handling for sections with Appwrite data
                if (item.id === "attractions") {
                    return (
                        <Section
                            subHeading={item.subHeading}
                            data={attractionsLoading ? [] : item.data}
                            cardComponent={item.cardComponent}
                            viewAll={item.viewAll}
                            isLoading={attractionsLoading}
                            loadingCardCount={3}
                        />
                    );
                }
                if (item.id === "souvenirs") {
                    return (
                        <Section
                            subHeading={item.subHeading}
                            data={souvenirsLoading ? [] : item.data}
                            cardComponent={item.cardComponent}
                            viewAll={item.viewAll}
                            isLoading={souvenirsLoading}
                            loadingCardCount={3}
                        />
                    );
                }
                if (item.id === "virtual_tours") {
                    return (
                        <Section
                            subHeading={item.subHeading}
                            data={virtualToursLoading ? [] : item.data}
                            cardComponent={item.cardComponent}
                            viewAll={item.viewAll}
                            isLoading={virtualToursLoading}
                            loadingCardCount={3}
                        />
                    );
                }
                return (
                    <Section
                        subHeading={item.subHeading}
                        data={item.data}
                        cardComponent={item.cardComponent}
                        viewAll={item.viewAll}
                    />
                );
            default:
                return null;
        }
    };
    // --- End Render Item Function ---

    return (
        <View style={styles.container}>
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
                        data={listData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        // estimatedItemSize={300}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContentContainer}
                        removeClippedSubviews={false}
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
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
