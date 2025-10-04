/**
 * StayDetails Component
 * Author: SomnathChW
 * Created: 2025-10-04
 *
 * This component renders the complete details page for a stay/hotel,
 * including title, pricing, amenities, location, contact info, and more.
 */

import React from "react";
import { View } from "react-native";
import { useHotelDetails } from "@/hooks/useEntityDetails";
import DetailsLoader from "../Common/DetailsLoader";
import TitleSection from "../Common/TitleSection";
import PricingSection from "./PricingSection";
import AboutSection from "../Common/AboutSection";
import AmenitiesSection from "./AmenitiesSection";
import LocationMapSection from "../Common/LocationMapSection";
import ContactSection from "./ContactSection";
import ExtraDetailsSection from "./ExtraDetailsSection";

type StaysDetailsProps = {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
};

export const StayDetails = ({
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
        <View style={{ flex: 1 }}>
            {/* Title with location and rating */}
            <TitleSection
                title={hotelDetails.name}
                location={hotelDetails.location}
                rating={hotelDetails.rating}
            />

            {/* Pricing information */}
            <PricingSection
                price={hotelDetails.price}
                originalPrice={hotelDetails.original_price}
                discountPercentage={hotelDetails.discount_percentage}
                priceRange={hotelDetails.price_range}
                currency={hotelDetails.currency}
            />

            {/* About/Description */}
            <AboutSection
                description={
                    hotelDetails.long_description ||
                    hotelDetails.short_description ||
                    "No description available for this property."
                }
            />

            {/* Amenities */}
            <AmenitiesSection amenities={hotelDetails.amenities || []} />

            {/* Location and Map */}
            {hotelDetails.latitude && hotelDetails.longitude && (
                <LocationMapSection
                    locationName={hotelDetails.location}
                    latitude={hotelDetails.latitude}
                    longitude={hotelDetails.longitude}
                    mapUrl={hotelDetails.map_url}
                />
            )}

            {/* Contact Information */}
            <ContactSection
                contactNumber={hotelDetails.contact_number}
                website={hotelDetails.website}
                name={hotelDetails.name}
            />

            {/* Extra Details */}
            <ExtraDetailsSection extraDetails={hotelDetails.extra_details} />
        </View>
    );
};

export default StayDetails;
