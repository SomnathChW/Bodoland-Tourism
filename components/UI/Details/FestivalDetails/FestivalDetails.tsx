import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useDataStore } from "@/store/useDataStore";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import { Ionicons } from "@expo/vector-icons";
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
    const { festivalDetails, isLoading, error } = useFestivalDetails({
        identifier,
        onDataFetched,
        onError,
    });

    // Show loading state with skeleton loader
    if (isLoading) {
        return <DetailsLoader />;
    }

    // Show error state and notify parent
    if (error) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Title Section */}
            <TitleSection title={festivalDetails.name} />

            {/* About Section */}
            <AboutSection description={festivalDetails.long_description} />

            {/* When and Where Section */}
            {/* <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>When & Where</Text>
                <View style={styles.separator} />
                
                {(festivalDetails.date || festivalDetails.celebration_time) && (
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={20} color="#646f7e" />
                        <Text style={styles.infoText}>
                            {festivalDetails.date || festivalDetails.celebration_time}
                        </Text>
                    </View>
                )}
                
                {(festivalDetails.location || festivalDetails.celebration_place) && (
                    <View style={styles.infoRow}>
                        <Ionicons name="location" size={20} color="#646f7e" />
                        <Text style={styles.infoText}>
                            {festivalDetails.location || festivalDetails.celebration_place}
                        </Text>
                    </View>
                )}
            </View> */}

            {/* Cultural Significance Section */}
            {festivalDetails.cultural_significance && (
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                        Cultural Significance
                    </Text>
                    <View style={styles.separator} />
                    <Text style={styles.details}>
                        {festivalDetails.cultural_significance}
                    </Text>
                </View>
            )}

            {/* Activities Section */}
            {/* {festivalDetails.activities && (
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Activities</Text>
                    <View style={styles.separator} />
                    <Text style={styles.details}>
                        {festivalDetails.activities}
                    </Text>
                </View>
            )} */}
        </View>
    );
};

export default FestivalDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 30,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#ff6b6b",
        fontSize: 16,
        textAlign: "center",
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "rgba(100, 111, 126, 0.2)",
        marginBottom: 15,
        width: "100%",
    },
    details: {
        color: "#FFFFFF",
        fontSize: 14,
        lineHeight: 22,
        textAlign: "justify",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    infoText: {
        color: "#FFFFFF",
        fontSize: 14,
        marginLeft: 10,
    },
});
