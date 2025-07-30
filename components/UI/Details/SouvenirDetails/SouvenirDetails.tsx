import TitleSection from "../Common/TitleSection";
import PricingSection from "./PricingSection";
import AboutSection from "../Common/AboutSection";
import DetailsSectionGroup from "./DetailsSection";
import { useSouvenirDetails } from "@/hooks/useEntityDetails";
import DetailsLoader from "@/components/UI/Details/Common/DetailsLoader";
import { View } from "react-native";

const SouvenirDetails = ({
    identifier,
    onDataFetched,
    onError,
}: {
    identifier: string;
    onDataFetched: (data: any) => void;
    onError?: () => void;
}) => {
    // Use the souvenirdetails hook to fetch souvenir data
    const { souvenirDetails, isLoading, error } = useSouvenirDetails({
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
