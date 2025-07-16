import { StyleSheet, View, Text, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import LocationMapSection from "./LocationMapSection";
import VirtualToursSection from "./VirtualToursSection";
import EntryFeeSection from "./EntryFeeSection";
import PackagesSection from "./PackagesSection";
import CustomAlertDialog from "../../CustomAlertDialog";
import { useDataStore } from "@/store/useDataStore";
import { Package } from "./PackagesSection"; // Import the Package type
import { useAppwriteDetailsQuery } from "@/hooks/useAppwriteDetailsQuery";
import { Ionicons } from "@expo/vector-icons";
import DetailsLoader from "@/components/DetailsLoader";

interface AttractionDetailsProps {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
}

const AttractionDetails = ({
    identifier,
    onDataFetched,
    onError,
}: AttractionDetailsProps) => {
    // State for alert dialog
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(
        null
    );

    // Function to handle opening phone or website
    const handleOpenContact = () => {
        if (!selectedPackage) return;

        if (selectedPackage.contact) {
            const phoneNumber = selectedPackage.contact.replace(/\s+/g, "");
            Linking.openURL(`tel:${phoneNumber}`);
        }
        setDialogVisible(false);
    };

    const handleOpenWebsite = () => {
        if (!selectedPackage || !selectedPackage.website) return;

        Linking.openURL(selectedPackage.website);
        setDialogVisible(false);
    };

    // Try to get the attraction details based on the identifier from store
    const attractionDetailsStore = useDataStore
        .getState()
        .attractions.find((attraction) => attraction.identifier === identifier);

    const { data, isLoading, error } = useAppwriteDetailsQuery({
        queryKey: ["attractions", identifier],
        type: "attractions",
        identifier: identifier,
        isEnabled: !attractionDetailsStore, // Only fetch if not in store
    });

    const attractionDetails = attractionDetailsStore || data?.data;

    // Send data back to parent component when attraction details are found
    useEffect(() => {
        if (attractionDetails && onDataFetched) {
            onDataFetched(attractionDetails);
        }
    }, [attractionDetails, onDataFetched]);

    // Show loading state with skeleton loader
    if (isLoading) {
        return <DetailsLoader />;
    }

    // Show error state and notify parent
    if (error) {
        // Call onError if provided to hide the header loader
        if (onError) {
            onError();
        }

        return (
            <View style={styles.errorContainer}>
                {/* Warning Icon */}
                <Ionicons name="warning-outline" size={24} color="#ff6b6b" />
                <Text style={styles.errorText}>Attraction Not Found</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <TitleSection
                title={attractionDetails.name}
                location={attractionDetails.location}
                rating={undefined}
            />
            <AboutSection
                description={
                    attractionDetails.long_description ||
                    "No description available for this attraction."
                }
            />
            <LocationMapSection
                locationName={attractionDetails.location}
                latitude={attractionDetails.latitude}
                longitude={attractionDetails.longitude}
                mapUrl={attractionDetails.map_url}
            />
            <VirtualToursSection
                tours={attractionDetails.virtual_tours || []}
                onTourPress={(tour) =>
                    console.log("Virtual tour selected:", tour.tour_resource)
                }
            />
            <EntryFeeSection
                fees={attractionDetails.entry_pricing || []}
                timings={{
                    hours: attractionDetails.timings,
                    days: attractionDetails.days,
                }}
            />
            <PackagesSection
                packages={attractionDetails.packages || []}
                onPackagePress={(pkg) => {
                    // Set the selected package and show dialog
                    setSelectedPackage(pkg);

                    // If only website is available, open it directly
                    if (pkg.website && !pkg.contact) {
                        Linking.openURL(pkg.website);
                        return;
                    }

                    // If only contact is available, call directly
                    if (pkg.contact && !pkg.website) {
                        const phoneNumber = pkg.contact.replace(/\s+/g, "");
                        Linking.openURL(`tel:${phoneNumber}`);
                        return;
                    }

                    // If both are available, show dialog
                    if (
                        (pkg.contact || pkg.website) &&
                        !(pkg.contact && pkg.website)
                    ) {
                        // If only one option is available, open it directly
                        if (pkg.contact) {
                            const phoneNumber = pkg.contact.replace(/\s+/g, "");
                            Linking.openURL(`tel:${phoneNumber}`);
                        } else if (pkg.website) {
                            Linking.openURL(pkg.website);
                        }
                        return;
                    }

                    // Show dialog if both options are available
                    if (pkg.contact && pkg.website) {
                        setDialogVisible(true);
                    }
                }}
            />

            {/* Custom Alert Dialog */}
            <CustomAlertDialog
                visible={dialogVisible}
                title="Contact Options"
                description={`How would you like to contact ${
                    selectedPackage?.name || "this package provider"
                }?`}
                buttons={[
                    {
                        text: "Cancel",
                        onPress: () => setDialogVisible(false),
                        type: "cancel",
                    },
                    {
                        text: "Call",
                        onPress: handleOpenContact,
                        type: "secondary",
                        disabled: !selectedPackage?.contact,
                    },
                    {
                        text: "Website",
                        onPress: handleOpenWebsite,
                        type: "primary",
                        disabled: !selectedPackage?.website,
                    },
                ]}
                onCancel={() => setDialogVisible(false)}
            />
        </View>
    );
};

export default AttractionDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "#ff6b6b",
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
});
