import { useDataStore } from "@/store/useDataStore";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import TitleSection from "../Common/TitleSection";
import PricingSection from "./PricingSection";
import AboutSection from "../Common/AboutSection";
import DetailsSectionGroup from "./DetailsSection";

const SouvenirDetails = ({
    identifier,
    onDataFetched,
}: {
    identifier: string;
    onDataFetched: (data: any) => void;
}) => {
    // Use zustand hook properly to subscribe to state changes
    const souvenirs = useDataStore((state) => state.souvenirs);
    
    // Memoize the souvenir details to prevent unnecessary re-computations
    const souvenirDetails = useMemo(() => {
        return souvenirs.find((souvenir) => souvenir.identifier === identifier);
    }, [souvenirs, identifier]);

    // Send data back to parent component when souvenir details are found
    useEffect(() => {
        if (souvenirDetails && onDataFetched) {
            onDataFetched(souvenirDetails);
        }
    }, [souvenirDetails, onDataFetched]);

    if (!souvenirDetails) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#ff6b6b", fontSize: 16 }}>
                    Souvenir not found
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <TitleSection
                title={souvenirDetails.name}
                rating={souvenirDetails.rating}
            />

            <PricingSection
                originalPrice={souvenirDetails.original_price}
                price={souvenirDetails.price}
                discountPercentage={souvenirDetails.discount_percentage}
                inStock={souvenirDetails.in_stock}
            />

            <AboutSection description={souvenirDetails.long_description} />

            <DetailsSectionGroup
                weight={souvenirDetails.weight}
                dimensions={souvenirDetails.dimensions}
                shipping_time_estimate={souvenirDetails.shipping_time_estimate}
                in_stock={souvenirDetails.in_stock}
                categories={souvenirDetails.categories}
                is_vegan={souvenirDetails.is_vegan}
                is_vegetarian={souvenirDetails.is_vegetarian}
                expiration_date={souvenirDetails.expiration_date}
            />
        </View>
    );
};

export default SouvenirDetails;

const styles = StyleSheet.create({});
