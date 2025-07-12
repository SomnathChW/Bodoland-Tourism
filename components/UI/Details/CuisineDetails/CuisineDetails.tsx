import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import { useDataStore } from "@/store/useDataStore";

interface CuisineDetailsProps {
    identifier: string;
    onDataFetched?: (data: any) => void;
}

const CuisineDetails = ({ identifier, onDataFetched }: CuisineDetailsProps) => {
    // Try to get the cuisine details based on the identifier from store
    const cuisineDetails = useDataStore
        .getState()
        .cuisine.find((cuisine) => cuisine.identifier === identifier);

    // Send data back to parent component when cuisine details are found
    useEffect(() => {
        if (cuisineDetails && onDataFetched) {
            onDataFetched(cuisineDetails);
        }
    }, [cuisineDetails, onDataFetched]);

    if (!cuisineDetails) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#ff6b6b", fontSize: 16 }}>
                    Cuisine not found
                </Text>
            </View>
        );
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

const styles = StyleSheet.create({});
