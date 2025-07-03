/**
 * AboutSection Component
 * Author: SomnathChW
 * Created: 2025-04-14 08:23:25 UTC
 *
 * This component renders the about section with description text
 * for the Details page.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

interface AboutSectionProps {
    // Optional description text - if not provided, uses default lorem ipsum
    description?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis, nunc vel tincidunt vestibulum, risus leo varius nisl, a dignissim velit massa eu mauris.",
}) => {
    return (
        <Animated.View
            style={styles.detailsSection}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>About</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Description Text */}
            <Text style={styles.details}>{description}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    detailsSection: {
        marginBottom: 30,
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
    details: {
        color: "#fff",
        fontFamily: "SfProMedium",
        fontSize: 16,
        lineHeight: 25,
        marginBottom: 15,
    },
});

// Memoize the component to prevent unnecessary re-renders
export default React.memo(AboutSection);
