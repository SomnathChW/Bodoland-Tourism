import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import FestivalDatesSection from "./FestivalDatesSection";
import CulturalSignificanceSection from "./CulturalSignificanceSection";
import ActivitiesSection from "./ActivitiesSection";
import RelatedLinksSection from "./RelatedLinksSection";
import { useFestivalDetails } from "@/hooks/useEntityDetails";
import DetailsLoader from "@/components/UI/Details/Common/DetailsLoader";

interface FestivalDetailsProps {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
}

const FestivalDetails = ({
    identifier,
    onDataFetched,
    onError,
}: FestivalDetailsProps) => {
    // Try to get the festival details based on the identifier from store
    const { festivalDetails, isLoading, error } = useFestivalDetails({
        identifier,
        onDataFetched,
        onError,
    });

    // Show loading state with skeleton loader
    if (isLoading) {
        return <DetailsLoader />;
    }

    // Show error state and parent notified by onError callback through hook
    if (error) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <TitleSection title={festivalDetails.name} rating={undefined} />
            <AboutSection description={festivalDetails.long_description} />

            <FestivalDatesSection dates={festivalDetails.dates} />

            <CulturalSignificanceSection
                culturalSignificance={festivalDetails.cultural_significance}
            />

            <ActivitiesSection activities={festivalDetails.activities} />

            <RelatedLinksSection relatedLinks={festivalDetails.related_links} />
        </View>
    );
};

export default FestivalDetails;
