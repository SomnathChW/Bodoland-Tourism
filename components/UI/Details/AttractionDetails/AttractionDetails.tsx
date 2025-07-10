import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import TitleSection from "../Common/TitleSection";
import AboutSection from "../Common/AboutSection";
import LocationMapSection from "./LocationMapSection";
import VirtualToursSection from "./VirtualToursSection";
import EntryFeeSection from "./EntryFeeSection";
import PackagesSection from "./PackagesSection";
import { Linking } from "react-native";
import CustomAlertDialog from "../../CustomAlertDialog";

// Define the structure of a package item for the alert dialog
interface Package {
    identifier: string;
    name: string;
    fromPrice: string | number;
    imageUrl: string;
    contact?: string;
    website?: string;
}

const AttractionDetails = ({ identifier }: { identifier: string }) => {
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

    return (
        <View style={{ flex: 1 }}>
            <TitleSection title={identifier} location="City Park" />
            <AboutSection
                description={
                    "Located in the heart of the city, this attraction offers stunning views and a rich history."
                }
            />
            <LocationMapSection
                locationName="City Park"
                latitude={26.2006}
                longitude={92.9376}
            />
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
                    console.log("Virtual tour selected:", tour.identifier)
                }
            />
            <EntryFeeSection
                fees={{
                    adult: "500",
                    child: "300",
                }}
                timings={{
                    hours: "10:00 AM - 6:00 PM",
                    days: "Monday to Sunday",
                }}
            />
            <PackagesSection
                packages={[
                    {
                        identifier: "pkg-001",
                        name: "Weekend Explorer",
                        fromPrice: "4,500",
                        imageUrl:
                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                        website: "https://example.com/weekend-explorer",
                    },
                    {
                        identifier: "pkg-002",
                        name: "Wildlife Safari",
                        fromPrice: "6,800",
                        imageUrl:
                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                        contact: "+91 12345 67890",
                        website: "https://example.com/wildlife-safari",
                    },
                    {
                        identifier: "pkg-003",
                        name: "Cultural Tour",
                        fromPrice: "3,200",
                        imageUrl:
                            "https://cloud.appwrite.io/v1/storage/buckets/placeholders/files/67eaf1f3002191537bba/view?project=bodoland-tourism",
                        contact: "+91 12345 67890",
                    },
                ]}
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

const styles = StyleSheet.create({});
