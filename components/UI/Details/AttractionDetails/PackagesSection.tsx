/**
 * PackagesSection Component
 * Author: GitHub Copilot
 * Created: 2025-07-09
 *
 * This component renders a horizontal scrollable list of tour packages
 * with image, name, and price information.
 */

import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import Animated, { FadeIn } from "react-native-reanimated";

// Get screen dimensions
const { width } = Dimensions.get("screen");

// Define the structure of a package item
export interface Package {
    identifier: string;
    name: string;
    from_price: string | number;
    image: string;
    contact?: string;
    website?: string;
}

interface PackagesSectionProps {
    packages: Package[];
    currency?: string;
    onPackagePress?: (packageItem: Package) => void;
    numCardsToShow?: number; // Number of cards to show on screen
}

// Constants for card dimensions calculation
const DEFAULT_NUM_CARDS = 2.5; // Default number of cards to show
const WIDTH_RATIO = 0.36; // Width ratio relative to screen width

/**
 * Individual package card component
 */
const PackageCard = React.memo(
    ({
        packageItem,
        currency = "₹",
        onPress,
        cardWidth,
    }: {
        packageItem: Package;
        currency?: string;
        onPress?: () => void;
        cardWidth: number;
    }) => {
        return (
            <TouchableOpacity
                style={[styles.packageCard, { width: cardWidth }]}
                activeOpacity={0.8}
                onPress={onPress}
            >
                {/* Card Image */}
                <View style={styles.packageCardImageContainer}>
                    <FastImage
                        source={{
                            uri: packageItem.image,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={styles.packageCardImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>

                {/* Card Content */}
                <View style={styles.packageCardContent}>
                    <Text style={styles.packageCardTitle} numberOfLines={1}>
                        {packageItem.name}
                    </Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.fromText}>From</Text>
                        <Text style={styles.priceText}>
                            {currency}
                            {packageItem.from_price}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
);

/**
 * End of data card component
 */
const EndDataCard = React.memo(({ cardWidth }: { cardWidth: number }) => {
    return (
        <View style={[styles.endCard, { width: cardWidth }]}>
            <View style={styles.endCardContent}>
                <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#646f7e"
                />
                <Text style={styles.endCardText}>That's all we have now</Text>
            </View>
        </View>
    );
});

/**
 * Empty state component when no packages are available
 */
const EmptyPackagesState = () => {
    return (
        <View style={styles.emptyStateContainer}>
            <MaterialIcons name="luggage" size={24} color="#646f7e" />
            <Text style={styles.emptyStateText}>
                Currently no offcial packages available for this attraction.
            </Text>
            <Text style={styles.emptyStateSubText}>
                Please visit the attraction and enquire!
            </Text>
        </View>
    );
};

/**
 * PackagesSection renders a horizontal scrollable list of tour packages
 */
const PackagesSection: React.FC<PackagesSectionProps> = ({
    packages,
    currency = "₹",
    onPackagePress,
    numCardsToShow = DEFAULT_NUM_CARDS,
}) => {
    // Calculate card width and spacing based on number of cards to show
    const cardWidth = Math.ceil(width * WIDTH_RATIO);
    const cardSpacing = Math.ceil(
        (width * (1 - WIDTH_RATIO * numCardsToShow)) / (numCardsToShow * 2)
    );

    // Handler for package card press
    const handlePackagePress = (packageItem: Package) => {
        if (onPackagePress) {
            onPackagePress(packageItem);
        }
    };

    return (
        <Animated.View
            style={styles.packagesSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Available Packages</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {packages.length === 0 ? (
                <EmptyPackagesState />
            ) : (
                <>
                    {/* Horizontal ScrollView for Cards */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.packagesCardsContainer}
                        removeClippedSubviews={true}
                        decelerationRate="fast"
                    >
                        {packages.map((packageItem) => (
                            <PackageCard
                                key={packageItem.identifier}
                                packageItem={packageItem}
                                currency={currency}
                                onPress={() => handlePackagePress(packageItem)}
                                cardWidth={cardWidth}
                            />
                        ))}
                        {/* End of data card */}
                        {packages.length > 0 && (
                            <EndDataCard cardWidth={cardWidth} />
                        )}
                    </ScrollView>

                    {/* Disclaimer Note */}
                    <View style={styles.disclaimerContainer}>
                        <Ionicons
                            name="information-circle-outline"
                            size={12}
                            color="#646f7e"
                        />
                        <Text style={styles.disclaimerText}>
                            Please confirm prices and availability with
                            respective providers
                        </Text>
                    </View>
                </>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    packagesSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "#646f7e",
        marginBottom: 15,
    },
    packagesCardsContainer: {
        paddingVertical: 10,
    },
    packageCard: {
        width: 150,
        marginRight: 12,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#1a2029",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    packageCardImageContainer: {
        width: "100%",
        height: 100,
        backgroundColor: "#1a2432", // Placeholder color while image loads
    },
    packageCardImage: {
        width: "100%",
        height: "100%",
    },
    packageCardContent: {
        padding: 8,
        height: 50,
        justifyContent: "center",
    },
    packageCardTitle: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 13,
        fontWeight: "bold",
        marginBottom: 4,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    fromText: {
        color: "rgba(255,255,255,0.5)",
        fontFamily: "SfProMedium",
        fontSize: 10,
        marginRight: 3,
    },
    priceText: {
        color: "rgba(255,255,255,0.8)",
        fontFamily: "SfProMedium",
        fontSize: 11,
        fontWeight: "500",
    },
    disclaimerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: 6,
        borderRadius: 6,
        marginHorizontal: 2,
    },
    disclaimerText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginLeft: 5,
    },
    // Empty state styles
    emptyStateContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a2029",
        borderRadius: 10,
        padding: 20,
        marginVertical: 15,
        marginHorizontal: 2,
    },
    emptyStateText: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 14,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 6,
    },
    emptyStateSubText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        textAlign: "center",
    },
    // End card styles
    endCard: {
        height: 160,
        marginRight: 12,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#1a2029",
        borderWidth: 1,
        borderColor: "#2c3440",
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
    },
    endCardContent: {
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        height: "100%",
        flex: 1,
    },
    endCardText: {
        color: "#646f7e",
        fontFamily: "SfProMedium",
        fontSize: 12,
        marginTop: 12,
        textAlign: "center",
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(PackagesSection);
