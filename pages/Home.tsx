import { Text, View, StatusBar, StyleSheet, ScrollView } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Section from "@/components/Section";
import CardVertical from "@/components/CardVertical";
import CardHorizontal from "@/components/CardHorizontal";
import Carousel from "@/components/Carousel";

import { carouselData } from "@/data/slider_data";
import { districtData } from "@/data/district_data";
import DistrictCards from "@/components/DistrictsCards";
import Animated from "react-native-reanimated";

const Home = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Animated.View
                        sharedTransitionTag="hello"
                        style={styles.logo}
                    >
                        <Ionicons
                            name="menu"
                            size={30}
                            style={styles.buttons}
                        />
                        <View>
                            <Text style={styles.headingText}>
                                Bodoland Tourism
                            </Text>
                            <Text style={styles.mainSubHeaddingText}>
                                For Peace and Development
                            </Text>
                        </View>
                    </Animated.View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>
                <ScrollView
                    style={styles.scrollPadding}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <Carousel itemList={carouselData} />
                    <Section
                        subHeading="Attractions"
                        data={districtData}
                        cardComponent={CardVertical}
                        viewAll={() => router.push("/attractions")}
                    />
                    <Section
                        subHeading="Districts"
                        data={districtData}
                        cardComponent={DistrictCards}
                        viewAll={() => router.push("/navigate")}
                    />
                    <Section
                        subHeading="Festivals"
                        data={districtData}
                        cardComponent={CardVertical}
                        viewAll={() => router.push("/festivals")}
                    />
                    <Section
                        subHeading="Cuisines"
                        data={districtData}
                        cardComponent={CardHorizontal}
                        viewAll={() => router.push("/cuisine")}
                    />
                    <Section
                        subHeading="Souvenirs"
                        data={districtData}
                        cardComponent={CardVertical}
                        viewAll={() => router.push("/souvenirs")}
                    />
                </ScrollView>
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
        paddingTop: StatusBar.currentHeight,
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
    scrollPadding: {
        paddingTop: 10,
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
    body: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
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
