/**
 * PricingSection Component for Stays
 * Author: SomnathChW
 * Created: 2025-10-04
 *
 * This component renders the pricing details for stays,
 * including price, original price, discount, and price range.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface PricingSectionProps {
    price?: string;
    originalPrice?: string;
    discountPercentage?: string;
    priceRange?: string;
    currency?: string;
}

/**
 * PricingSection renders pricing information for stays
 */
export const PricingSection: React.FC<PricingSectionProps> = ({
    price,
    originalPrice,
    discountPercentage,
    priceRange,
    currency: currencyCode,
}) => {
    // Convert currency code to symbol
    let currency: string;
    if (currencyCode === "INR") {
        currency = "₹";
    } else if (currencyCode === "USD") {
        currency = "$";
    } else if (currencyCode === "EUR") {
        currency = "€";
    } else if (currencyCode === "GBP") {
        currency = "£";
    } else {
        currency = currencyCode ?? "₹";
    }

    // Don't render if no pricing information is available
    if (!price && !priceRange) {
        return null;
    }

    return (
        <Animated.View
            style={styles.pricingSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Pricing</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Price Display */}
            {price && (
                <View style={styles.priceDisplay}>
                    <Text style={styles.currentPrice}>
                        {currency}
                        {price}
                    </Text>
                    {originalPrice && (
                        <Text style={styles.originalPrice}>
                            {currency}
                            {originalPrice}
                        </Text>
                    )}
                    {discountPercentage && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                                {discountPercentage}% OFF
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* Price Range Display */}
            {priceRange && (
                <View style={styles.priceRangeContainer}>
                    <Ionicons name="wallet-outline" size={16} color="#646f7e" />
                    <Text style={styles.priceRangeLabel}>Price Range:</Text>
                    <Text style={styles.priceRangeValue}>{priceRange}</Text>
                </View>
            )}

            {/* Per Night Label */}
            {price && (
                <Text style={styles.perNightText}>* Price per night</Text>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    pricingSection: {
        marginBottom: 25,
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
        backgroundColor: "#646f7e",
        marginBottom: 15,
    },
    priceDisplay: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    currentPrice: {
        color: "#ffffff",
        fontFamily: "SfProMedium",
        fontSize: 24,
        fontWeight: "bold",
    },
    originalPrice: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 16,
        textDecorationLine: "line-through",
        marginLeft: 10,
    },
    discountBadge: {
        backgroundColor: "rgba(100, 111, 126, 0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 10,
    },
    discountText: {
        color: "#27ae60",
        fontFamily: "SfProMedium",
        fontSize: 12,
        fontWeight: "bold",
    },
    priceRangeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        gap: 6,
    },
    priceRangeLabel: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 14,
    },
    priceRangeValue: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 14,
        fontWeight: "600",
    },
    perNightText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginTop: 8,
        fontStyle: "italic",
    },
});

export default React.memo(PricingSection);
