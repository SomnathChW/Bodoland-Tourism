/**
 * DetailsSectionGroup Component (formerly TabsDetailSection)
 * Author: SomnathChW
 * Created: 2025-07-10
 * Updated: 2025-07-10
 *
 * This component renders product details in grouped sections
 * for the Souvenir Details page.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

interface DetailsSectionGroupProps {
    weight?: string;
    dimensions?: string;
    shipping_time_estimate?: string;
    in_stock: boolean;
    categories?: string;
    is_vegan?: boolean | null;
    is_vegetarian?: boolean | null;
    expiration_date?: string | null;
}

// Renamed component to reflect its new behavior
const DetailsSectionGroup: React.FC<DetailsSectionGroupProps> = ({
    weight,
    dimensions,
    shipping_time_estimate,
    in_stock,
    categories,
    is_vegan,
    is_vegetarian,
    expiration_date,
}) => {
    // Helper to determine if a section should be shown
    const hasSpecsContent = weight || dimensions;
    const hasShippingContent = shipping_time_estimate || in_stock !== undefined;
    const hasCategoryContent =
        categories ||
        (categories === "food & beverages" &&
            (is_vegan !== null || is_vegetarian !== null || expiration_date));

    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Product Details</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* All content is displayed at once, but in distinct sections */}

            {/* Specifications Section */}
            {hasSpecsContent && (
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="cube-outline"
                            size={16}
                            color="#646f7e"
                        />
                        <Text style={styles.sectionHeaderText}>
                            Specifications
                        </Text>
                    </View>
                    <View style={styles.contentContainer}>
                        {weight && (
                            <View style={styles.detailRow}>
                                <Ionicons
                                    name="cube-outline"
                                    size={16}
                                    color="#646f7e"
                                />
                                <Text style={styles.detailLabel}>Weight:</Text>
                                <Text style={styles.detailValue}>{weight}</Text>
                            </View>
                        )}
                        {dimensions && (
                            <View style={styles.detailRow}>
                                <Ionicons
                                    name="resize-outline"
                                    size={16}
                                    color="#646f7e"
                                />
                                <Text style={styles.detailLabel}>
                                    Dimensions:
                                </Text>
                                <Text style={styles.detailValue}>
                                    {dimensions}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Shipping Section */}
            {hasShippingContent && (
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="car-outline"
                            size={16}
                            color="#646f7e"
                        />
                        <Text style={styles.sectionHeaderText}>Shipping</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        {shipping_time_estimate && (
                            <View style={styles.detailRow}>
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color="#646f7e"
                                />
                                <Text style={styles.detailLabel}>
                                    Delivery Time:
                                </Text>
                                <Text style={styles.detailValue}>
                                    {shipping_time_estimate}
                                </Text>
                            </View>
                        )}
                        <View style={styles.detailRow}>
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={16}
                                color="#646f7e"
                            />
                            <Text style={styles.detailLabel}>
                                Availability:
                            </Text>
                            <Text
                                style={[
                                    styles.detailValue,
                                    { color: in_stock ? "#4CAF50" : "#F44336" },
                                ]}
                            >
                                {in_stock ? "In Stock" : "Out of Stock"}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Category Section */}
            {hasCategoryContent && (
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="list-outline"
                            size={16}
                            color="#646f7e"
                        />
                        <Text style={styles.sectionHeaderText}>Category</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        {categories && (
                            <View style={styles.detailRow}>
                                <Ionicons
                                    name="list-outline"
                                    size={16}
                                    color="#646f7e"
                                />
                                <Text style={styles.detailLabel}>
                                    Category:
                                </Text>
                                <Text style={styles.detailValue}>
                                    {categories}
                                </Text>
                            </View>
                        )}
                        {categories === "food & beverages" && (
                            <>
                                {is_vegan !== null && (
                                    <View style={styles.detailRow}>
                                        <Ionicons
                                            name="leaf-outline"
                                            size={16}
                                            color="#646f7e"
                                        />
                                        <Text style={styles.detailLabel}>
                                            Vegan:
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {is_vegan ? "Yes" : "No"}
                                        </Text>
                                    </View>
                                )}
                                {is_vegetarian !== null && (
                                    <View style={styles.detailRow}>
                                        <Ionicons
                                            name="nutrition-outline"
                                            size={16}
                                            color="#646f7e"
                                        />
                                        <Text style={styles.detailLabel}>
                                            Vegetarian:
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {is_vegetarian ? "Yes" : "No"}
                                        </Text>
                                    </View>
                                )}
                                {expiration_date && (
                                    <View style={styles.detailRow}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={16}
                                            color="#646f7e"
                                        />
                                        <Text style={styles.detailLabel}>
                                            Expires:
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {expiration_date}
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 1,
        backgroundColor: "#646f7e",
        marginBottom: 10,
    },
    sectionContainer: {
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    sectionHeaderText: {
        color: "#646f7e",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 6,
    },
    contentContainer: {
        padding: 12,
        backgroundColor: "rgba(100, 111, 126, 0.1)",
        borderRadius: 8,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    detailLabel: {
        color: "#646f7e",
        fontSize: 12,
        marginLeft: 6,
        marginRight: 4,
    },
    detailValue: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
    },
});

export default React.memo(DetailsSectionGroup);
