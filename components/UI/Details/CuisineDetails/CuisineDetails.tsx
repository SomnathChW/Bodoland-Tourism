import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import { useCuisineDetails } from "@/hooks/useEntityDetails";
import DetailsLoader from "@/components/UI/Details/Common/DetailsLoader";
import DetailsError from "../Common/DetailsError";

interface CuisineDetailsProps {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
}

const CuisineDetails = ({
    identifier,
    onDataFetched,
    onError,
}: CuisineDetailsProps) => {
    // Try to get the cuisine details based on the identifier from store
    const { cuisineDetails, isLoading, error } = useCuisineDetails({
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
            <TitleSection title={cuisineDetails.name} rating={undefined} />
            <AboutSection description={cuisineDetails.long_description} />

            {/* Additional sections can be added here as needed:
               - Ingredients section
               - Preparation method
               - Nutritional info
               - Cultural significance
               - etc.
            */}
        </View>
    );
};

export default CuisineDetails;
