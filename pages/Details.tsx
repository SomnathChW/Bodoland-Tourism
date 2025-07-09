import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderSection from "@/components/UI/Details/HeaderSection";
import TitleSection from "@/components/UI/Details/TitleSection";
import AboutSection from "@/components/UI/Details/AboutSection";
import FeaturesSection from "@/components/UI/Details/FeaturesSection";
import SimilarPlacesSection from "@/components/UI/Details/SimilarPlacesSection";
import EntryFeeSection from "@/components/UI/Details/EntryFeeSection";
import LocationMapSection from "@/components/UI/Details/LocationMapSection";
import PackagesSection from "@/components/UI/Details/PackagesSection";
import VirtualToursSection from "@/components/UI/Details/VirtualToursSection";

const { height } = Dimensions.get("screen");
const HEADER_MAX_HEIGHT = height * 0.45;
const HEADER_MIN_HEIGHT = 55;

const Details = () => {
    const params = useLocalSearchParams();
    const identifier = params?.identifier || "Sample Place";
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const minimizedHeaderHeight = HEADER_MIN_HEIGHT + insets.top;
    const scrollDistance = HEADER_MAX_HEIGHT - minimizedHeaderHeight;

    // Animation values
    const scrollY = useSharedValue(0);
    const isReady = useSharedValue(1); // Always set to 1 since we don't need phased loading

    // Scroll handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            scrollY.value = event.contentOffset.y;
        },
    });

    // Cleanup animations on unmount
    useEffect(() => {
        return () => {
            cancelAnimation(scrollY);
            cancelAnimation(isReady);
        };
    }, []);

    // Static styles calculated once
    const staticStyles = React.useMemo(
        () => ({
            scrollContentContainer: {
                paddingTop: HEADER_MAX_HEIGHT,
            },
        }),
        []
    );

    // Function to return structure based on identifier
    const getDetailsStructure = (identifier: string) => {
        if (!identifier) {
            return [
                {
                    key: "title",
                    component: <TitleSection identifier={identifier} />,
                },
            ];
        }

        const detail_type = identifier.split(/[-_]/)[0].toLowerCase();
        switch (detail_type) {
            case "attraction":
                return [
                    {
                        key: "title",
                        component: (
                            <TitleSection
                                identifier={identifier}
                                showRating={false}
                                location={true}
                            />
                        ),
                    },
                    { key: "about", component: <AboutSection /> },

                    {
                        key: "location_map",
                        component: (
                            <LocationMapSection
                                latitude={26.6583}
                                longitude={91.0014}
                                locationName="Manas National Park"
                            />
                        ),
                    },
                    {
                        key: "virtualTours",
                        component: (
                            <VirtualToursSection
                                tours={[
                                    {
                                        identifier: "vt-001",
                                        name: "Main Temple View",
                                        imageUrl:
                                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                                    },
                                    {
                                        identifier: "vt-002",
                                        name: "Scenic Lake Tour",
                                        imageUrl:
                                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                                    },
                                    {
                                        identifier: "vt-003",
                                        name: "Mountain Vista",
                                        imageUrl:
                                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                                    },
                                ]}
                                onTourPress={(tour) =>
                                    console.log(
                                        "Virtual tour selected:",
                                        tour.identifier
                                    )
                                }
                            />
                        ),
                    },
                    {
                        key: "entry_fees",
                        component: (
                            <EntryFeeSection
                                fees={{
                                    adult: "1500",
                                    child: "Free",
                                }}
                                timings={{
                                    hours: "6:00 AM - 6:00 PM",
                                    days: "Monday - Sunday",
                                }}
                            />
                        ),
                    },
                    {
                        key: "packages",
                        component: (
                            <PackagesSection
                                packages={[
                                    {
                                        identifier: "pkg-001",
                                        name: "Weekend Explorer",
                                        fromPrice: "4,500",
                                        imageUrl:
                                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                                    },
                                    {
                                        identifier: "pkg-002",
                                        name: "Wildlife Safari",
                                        fromPrice: "6,800",
                                        imageUrl:
                                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                                    },
                                    {
                                        identifier: "pkg-003",
                                        name: "Cultural Tour",
                                        fromPrice: "3,200",
                                        imageUrl:
                                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                                    },
                                ]}
                                onPackagePress={(pkg) =>
                                    console.log(
                                        "Package selected:",
                                        pkg.identifier
                                    )
                                }
                            />
                        ),
                    },
                ];
            case "placeB":
                return [
                    {
                        key: "title",
                        component: <TitleSection identifier={identifier} />,
                    },
                    { key: "features", component: <FeaturesSection /> },
                ];
            default:
                return [
                    {
                        key: "title",
                        component: <TitleSection identifier={identifier} />,
                    },
                    { key: "about", component: <AboutSection /> },
                    { key: "features", component: <FeaturesSection /> },
                    { key: "similar", component: <SimilarPlacesSection /> },
                ];
        }
    };

    return (
        <View style={styles.container}>
            <HeaderSection
                scrollY={scrollY}
                isReady={isReady}
                animationPhase={2}
                hasModel={true}
                minimizedHeaderHeight={minimizedHeaderHeight}
                scrollDistance={scrollDistance}
                identifier={identifier as string}
                onBack={() => router.back()}
                insets={insets}
            />

            <Animated.ScrollView
                contentContainerStyle={[
                    styles.scrollViewContent,
                    staticStyles.scrollContentContainer,
                ]}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                overScrollMode="never"
                keyboardShouldPersistTaps="handled"
            >
                {/* Render sections based on structure */}
                {getDetailsStructure(identifier as string).map((section) => (
                    <React.Fragment key={section.key}>
                        {section.component}
                    </React.Fragment>
                ))}
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    scrollViewContent: {
        paddingHorizontal: 20,
    },
});

export default Details;
