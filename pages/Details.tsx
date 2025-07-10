import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderSection from "@/components/UI/Details/Common/HeaderSection";
import TitleSection from "@/components/UI/Details/Common/TitleSection";
import AboutSection from "@/components/UI/Details/Common/AboutSection";
import FeaturesSection from "@/components/UI/Details/FeaturesSection";
import SimilarPlacesSection from "@/components/UI/Details/SimilarPlacesSection";
import EntryFeeSection from "@/components/UI/Details/AttractionDetails/EntryFeeSection";
import LocationMapSection from "@/components/UI/Details/AttractionDetails/LocationMapSection";
import PackagesSection from "@/components/UI/Details/AttractionDetails/PackagesSection";
import VirtualToursSection from "@/components/UI/Details/AttractionDetails/VirtualToursSection";
import PricingSection from "@/components/UI/Details/SouvenirDetails/PricingSection";
import StickyPurchaseButtons from "@/components/UI/Details/SouvenirDetails/StickyPurchaseButtons";
import DetailsSectionGroup from "@/components/UI/Details/SouvenirDetails/SouvenirDetailsSection";

// Import data
import { souvenirData } from "@/data/souvenir_data";

const { height } = Dimensions.get("screen");
const HEADER_MAX_HEIGHT = height * 0.45;
const HEADER_MIN_HEIGHT = 55;

const Details = () => {
    const params = useLocalSearchParams();
    const identifier = params?.identifier || "Sample Place";
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Check if the current page is a souvenir page
    const isSouvenirPage = identifier?.toString().startsWith("souvenir-");

    // Get souvenir data if it's a souvenir page
    const souvenirItem = isSouvenirPage
        ? souvenirData.find((item) => item.identifier === identifier)
        : null;

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
            case "souvenir":
                // Find the souvenir item by identifier
                const souvenirItem = souvenirData.find(
                    (item) => item.identifier === identifier
                );

                if (!souvenirItem) {
                    return [
                        {
                            key: "title",
                            component: <TitleSection identifier={identifier} />,
                        },
                    ];
                }

                return [
                    {
                        key: "title",
                        component: (
                            <TitleSection
                                identifier={souvenirItem.title}
                                showRating={true}
                            />
                        ),
                    },
                    {
                        key: "about",
                        component: (
                            <AboutSection
                                description={souvenirItem.long_description}
                            />
                        ),
                    },
                    {
                        key: "pricing",
                        component: (
                            <PricingSection
                                originalPrice={souvenirItem.original_price}
                                price={souvenirItem.price}
                                discountPercentage={
                                    souvenirItem.discount_percentage
                                }
                                inStock={souvenirItem.in_stock}
                            />
                        ),
                    },
                    {
                        key: "details",
                        component: (
                            <DetailsSectionGroup
                                weight={souvenirItem.weight}
                                dimensions={souvenirItem.dimensions}
                                shipping_time_estimate={
                                    souvenirItem.shipping_time_estimate
                                }
                                in_stock={souvenirItem.in_stock}
                                categories={souvenirItem.categories}
                                is_vegan={souvenirItem.is_vegan}
                                is_vegetarian={souvenirItem.is_vegetarian}
                                expiration_date={souvenirItem.expiration_date}
                            />
                        ),
                    },
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
                    // Add bottom padding to ensure content isn't hidden behind sticky buttons
                    isSouvenirPage && { paddingBottom: 80 },
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

            {/* Render sticky purchase buttons for souvenirs */}
            {isSouvenirPage && souvenirItem && (
                <StickyPurchaseButtons inStock={souvenirItem.in_stock} />
            )}
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
