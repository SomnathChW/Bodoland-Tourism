import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

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
                            size={18}
                            color="#ffffff"
                        />
                        <Text style={styles.sectionHeaderText}>
                            Specifications
                        </Text>
                    </View>
                    <View style={styles.contentContainer}>
                        {weight && (
                            <View
                                style={[
                                    styles.detailRow,
                                    !dimensions && styles.lastRow,
                                ]}
                            >
                                <View style={styles.detailTypeContainer}>
                                    <Ionicons
                                        name="scale-outline"
                                        size={14}
                                        color="#ffffff"
                                    />
                                    <Text style={styles.detailLabel}>
                                        Weight
                                    </Text>
                                </View>
                                <Text style={styles.detailValue}>{weight}</Text>
                            </View>
                        )}
                        {dimensions && (
                            <View style={[styles.detailRow, styles.lastRow]}>
                                <View style={styles.detailTypeContainer}>
                                    <Ionicons
                                        name="resize-outline"
                                        size={14}
                                        color="#ffffff"
                                    />
                                    <Text style={styles.detailLabel}>
                                        Dimensions
                                    </Text>
                                </View>
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
                            size={18}
                            color="#ffffff"
                        />
                        <Text style={styles.sectionHeaderText}>
                            Shipping & Availability
                        </Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <View
                            style={[
                                styles.detailRow,
                                !shipping_time_estimate && styles.lastRow,
                            ]}
                        >
                            <View style={styles.detailTypeContainer}>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={14}
                                    color="#ffffff"
                                />
                                <Text style={styles.detailLabel}>
                                    Stock Status
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.detailValue,
                                    {
                                        color: in_stock ? "#27ae60" : "#e74c3c",
                                        fontWeight: "bold",
                                    },
                                ]}
                            >
                                {in_stock ? "✓ In Stock" : "✗ Out of Stock"}
                            </Text>
                        </View>
                        {shipping_time_estimate && (
                            <View style={[styles.detailRow, styles.lastRow]}>
                                <View style={styles.detailTypeContainer}>
                                    <Ionicons
                                        name="time-outline"
                                        size={14}
                                        color="#ffffff"
                                    />
                                    <Text style={styles.detailLabel}>
                                        Delivery Time
                                    </Text>
                                </View>
                                <Text style={styles.detailValue}>
                                    {shipping_time_estimate}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Category Section */}
            {hasCategoryContent && (
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="list-outline"
                            size={18}
                            color="#ffffff"
                        />
                        <Text style={styles.sectionHeaderText}>
                            Product Information
                        </Text>
                    </View>
                    <View style={styles.contentContainer}>
                        {categories && (
                            <View
                                style={[
                                    styles.detailRow,
                                    categories !== "food & beverages" &&
                                        styles.lastRow,
                                    categories === "food & beverages" &&
                                        is_vegan === null &&
                                        is_vegetarian === null &&
                                        !expiration_date &&
                                        styles.lastRow,
                                ]}
                            >
                                <View style={styles.detailTypeContainer}>
                                    <Ionicons
                                        name="grid-outline"
                                        size={14}
                                        color="#ffffff"
                                    />
                                    <Text style={styles.detailLabel}>
                                        Category
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.detailValue,
                                        styles.categoryTag,
                                    ]}
                                >
                                    {categories}
                                </Text>
                            </View>
                        )}
                        {categories === "food & beverages" && (
                            <>
                                {is_vegan !== null && (
                                    <View
                                        style={[
                                            styles.detailRow,
                                            is_vegetarian === null &&
                                                !expiration_date &&
                                                styles.lastRow,
                                        ]}
                                    >
                                        <View
                                            style={styles.detailTypeContainer}
                                        >
                                            <Ionicons
                                                name="leaf-outline"
                                                size={14}
                                                color="#ffffff"
                                            />
                                            <Text style={styles.detailLabel}>
                                                Vegan Friendly
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.detailValue,
                                                {
                                                    color: is_vegan
                                                        ? "#27ae60"
                                                        : "#ff6b6b",
                                                },
                                            ]}
                                        >
                                            {is_vegan ? "✓ Yes" : "✗ No"}
                                        </Text>
                                    </View>
                                )}
                                {is_vegetarian !== null && (
                                    <View
                                        style={[
                                            styles.detailRow,
                                            !expiration_date && styles.lastRow,
                                        ]}
                                    >
                                        <View
                                            style={styles.detailTypeContainer}
                                        >
                                            <Ionicons
                                                name="nutrition-outline"
                                                size={14}
                                                color="#ffffff"
                                            />
                                            <Text style={styles.detailLabel}>
                                                Vegetarian
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.detailValue,
                                                {
                                                    color: is_vegetarian
                                                        ? "#27ae60"
                                                        : "#ff6b6b",
                                                },
                                            ]}
                                        >
                                            {is_vegetarian ? "✓ Yes" : "✗ No"}
                                        </Text>
                                    </View>
                                )}
                                {expiration_date && (
                                    <View
                                        style={[
                                            styles.detailRow,
                                            styles.lastRow,
                                        ]}
                                    >
                                        <View
                                            style={styles.detailTypeContainer}
                                        >
                                            <Ionicons
                                                name="calendar-outline"
                                                size={14}
                                                color="#ffffff"
                                            />
                                            <Text style={styles.detailLabel}>
                                                Best Before
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.detailValue,
                                                styles.expiryDate,
                                            ]}
                                        >
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
        marginBottom: 8,
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
    sectionContainer: {
        marginTop: 14,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        paddingBottom: 8,
        marginBottom: 12,
    },
    sectionHeaderText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        marginLeft: 8,
    },
    contentContainer: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 16,
        paddingTop: 12,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        paddingVertical: 2,
    },
    lastRow: {
        marginBottom: 0,
    },
    detailTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    detailLabel: {
        color: "#ffffff",
        fontSize: 14,
        fontFamily: "SfProMedium",
        marginLeft: 10,
    },
    detailValue: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        textAlign: "right",
    },
    categoryTag: {
        backgroundColor: "rgba(46, 204, 113, 0.15)",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        color: "#2ecc71",
        textTransform: "capitalize",
        fontSize: 14,
        fontWeight: "bold",
    },
    expiryDate: {
        color: "#f39c12",
        fontWeight: "600",
    },
});

export default React.memo(DetailsSectionGroup);
