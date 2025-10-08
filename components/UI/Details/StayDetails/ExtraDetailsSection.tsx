/**
 * ExtraDetailsSection Component for Stays
 * Author: SomnathChW
 * Created: 2025-10-04
 *
 * This component renders extra details/information about the stay
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface ExtraDetailsSectionProps {
    extraDetails?: string;
}

/**
 * ExtraDetailsSection renders additional information about the stay
 */
export const ExtraDetailsSection: React.FC<ExtraDetailsSectionProps> = ({
    extraDetails,
}) => {
    // Don't render if no extra details
    if (!extraDetails || extraDetails.trim().length === 0) {
        return null;
    }

    return (
        <Animated.View
            style={styles.extraDetailsSection}
            entering={FadeIn.duration(300)}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Additional Information</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Extra Details Text */}
            <Text style={styles.detailsText}>{extraDetails}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    extraDetailsSection: {
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
    detailsText: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 16,
        lineHeight: 25,
    },
});

export default React.memo(ExtraDetailsSection);
