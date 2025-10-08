import { StyleSheet, View } from "react-native";
import React from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import { useDistrictDetails } from "@/hooks/useEntityDetails";
import DetailsLoader from "@/components/UI/Details/Common/DetailsLoader";

interface DistrictDetailsProps {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
}

const DistrictDetails = ({
    identifier,
    onDataFetched,
    onError,
}: DistrictDetailsProps) => {
    // Use the district details hook to fetch district data
    const { districtDetails, isLoading, error } = useDistrictDetails({
        identifier,
        onDataFetched,
        onError,
    });

    // Show loading state with skeleton loader
    if (isLoading) {
        return <DetailsLoader />;
    }

    if (error) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <TitleSection
                title={districtDetails.name}
                location={districtDetails.location}
                rating={undefined}
            />
            <AboutSection
                description={
                    districtDetails.long_description ||
                    districtDetails.short_description ||
                    "No description available for this district."
                }
            />
        </View>
    );
};

export default DistrictDetails;
