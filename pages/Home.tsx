import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    Platform,
    FlatList,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
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
import { useAuth } from "@/context/AuthContext";
import AlertDialog from "@/components/UI/AlertDialog";
import { useDrawer } from "@/context/DrawerContext";

type ListItem =
    | {
          type: "carousel";
          id: string;
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
          data: typeof districtData;
          cardComponent: typeof CardVertical | typeof CardHorizontal;
          viewAll?: () => void;
      };

const Home = () => {
    const router = useRouter();
    const { signOut } = useAuth();
    const { toggleDrawer } = useDrawer();

    const [showDialog, setShowDialog] = useState(false);

    const handleDialog = () => {
        setShowDialog(!showDialog);
    };

    const handleSignOut = async () => {
        handleDialog();
        await signOut();
    };

    const listData: ListItem[] = [
        {
            type: "carousel",
            id: "carousel",
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
            id: "360view",
            subHeading: "360 View",
            data: districtData,
            cardComponent: CardHorizontal,
            viewAll: () => router.push("/virtual_tours"),
        },
        {
            type: "section",
            id: "souvenirs",
            subHeading: "Souvenirs",
            data: districtData,
            cardComponent: CardVertical,
            viewAll: () => router.push("/souvenirs"),
        },
        {
            type: "section",
            id: "attractions",
            subHeading: "Attractions",
            data: districtData,
            cardComponent: CardHorizontal,
            viewAll: () => router.push("/attractions"),
        },
    ];

    const renderItem = ({ item }: { item: ListItem }) => {
        switch (item.type) {
            case "carousel":
                return (
                    <View style={{ paddingBottom: 10 }}>
                        <Carousel />
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
                    <Ionicons
                        name="search"
                        size={30}
                        style={styles.buttons}
                        onPress={handleDialog}
                    />
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

                {/* AlertDialog remains the same */}
                <AlertDialog
                    visible={showDialog}
                    title="Sign Out"
                    description="Are you sure you want to sign out?"
                    onCancel={handleDialog}
                    onConfirm={handleSignOut}
                />
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
