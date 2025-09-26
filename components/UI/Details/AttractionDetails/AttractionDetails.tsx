import { StyleSheet, View, Text, Linking } from "react-native";
import React, { useState } from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import LocationMapSection from "./LocationMapSection";
import VirtualToursSection from "./VirtualToursSection";
import EntryFeeSection from "./EntryFeeSection";
import PackagesSection from "./PackagesSection";
import AlertDialog from "@/components/UI/AlertDialog";
import { Package } from "./PackagesSection"; // Import the Package type
import { useAttractionDetails } from "@/hooks/useEntityDetails";
import DetailsLoader from "@/components/UI/Details/Common/DetailsLoader";

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

    const handlePackagePress = (pkg: any) => {
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
        if ((pkg.contact || pkg.website) && !(pkg.contact && pkg.website)) {
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
    };

    // Use the attraction details hook to fetch attraction data
    const { attractionDetails, isLoading, error } = useAttractionDetails({
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
                onPackagePress={handlePackagePress}
            />

            {/* Alert Dialog */}
            <AlertDialog
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
