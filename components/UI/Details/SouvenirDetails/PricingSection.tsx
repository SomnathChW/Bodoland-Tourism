/**
 * PricingSection Component
 * Author: SomnathChW
 * Created: 2025-07-10
 *
 * This component renders the pricing details and discount information
 * for the Souvenir Details page.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface PricingSectionProps {
    originalPrice?: string;
    price: string;
    discountPercentage?: string;
    inStock: boolean;
}

/**
 * PricingSection renders pricing information
 */
const PricingSection: React.FC<PricingSectionProps> = ({
    originalPrice,
    price,
    discountPercentage,
    inStock,
}) => {
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
            <View style={styles.priceContainer}>
                <View style={styles.priceDisplay}>
                    <Text style={styles.currentPrice}>₹{price}</Text>
                    {originalPrice && (
                        <Text style={styles.originalPrice}>
                            ₹{originalPrice}
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

                <View style={styles.stockInfo}>
                    <Ionicons
                        name={inStock ? "checkmark-circle" : "close-circle"}
                        size={16}
                        color={inStock ? "#27ae60" : "#e74c3c"}
                    />
                    <Text
                        style={[
                            styles.stockText,
                            { color: inStock ? "#27ae60" : "#e74c3c" },
                        ]}
                    >
                        {inStock ? "In Stock" : "Out of Stock"}
                    </Text>
                </View>
            </View>
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
    priceContainer: {
        marginBottom: 10,
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
        fontSize: 12,
        fontWeight: "bold",
    },
    stockInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    stockText: {
        marginLeft: 5,
        fontSize: 14,
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(PricingSection);
