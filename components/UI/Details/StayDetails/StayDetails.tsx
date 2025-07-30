import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useHotelDetails } from "@/hooks/useEntityDetails";
import DetailsLoader from "../Common/DetailsLoader";

type StaysDetailsProps = {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
};

const StayDetails = ({
    identifier,
    onDataFetched,
    onError,
}: StaysDetailsProps) => {
    
    const { hotelDetails, isLoading, error } = useHotelDetails({
        identifier,
        onDataFetched,
        onError,
    });

    if (isLoading) {
        return <DetailsLoader />;
    }

    if (error) {
        return null;
    }

    return (
        <View>
            <Text>StayDetails for: {identifier}</Text>
        </View>
    );
};

export default StayDetails;
