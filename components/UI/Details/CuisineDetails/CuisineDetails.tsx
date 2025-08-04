import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import IngredientsSection from "./IngredientsSection";
import CulturalSignificanceSection from "./CulturalSignificanceSection";
import NutritionalInfoSection from "./NutritionalInfoSection";
import RecipeSection from "./RecipeSection";
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

            <CulturalSignificanceSection
                culturalSignificance={cuisineDetails.cultural_significance}
                isVegan={cuisineDetails.is_vegan}
                isVegetarian={cuisineDetails.is_vegetarian}
            />

            <NutritionalInfoSection
                nutritionalInfo={cuisineDetails.nutritional_info}
            />

            <IngredientsSection ingredients={cuisineDetails.ingredients} />

            <RecipeSection recipeUrl={cuisineDetails.recipe_url} />
        </View>
    );
};

export default CuisineDetails;
