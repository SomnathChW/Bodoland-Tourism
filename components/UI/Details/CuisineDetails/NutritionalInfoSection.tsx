import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface NutritionalInfoSectionProps {
    nutritionalInfo?: {
        calories?: string;
        protein?: string;
        carbs?: string;
        fat?: string;
        fiber?: string;
        [key: string]: any;
    };
}

const NutritionalInfoSection: React.FC<NutritionalInfoSectionProps> = ({
    nutritionalInfo = {},
}) => {
    // Don't render if no nutritional information is available
    if (!nutritionalInfo || Object.keys(nutritionalInfo).length === 0) {
        return null;
    }

    const nutritionItems = [
        { key: "calories", label: "Calories", icon: "fire", unit: "kcal" },
        { key: "protein", label: "Protein", icon: "dumbbell", unit: "g" },
        { key: "carbs", label: "Carbohydrates", icon: "grain", unit: "g" },
        { key: "fat", label: "Fat", icon: "oil", unit: "g" },
        { key: "fiber", label: "Fiber", icon: "leaf", unit: "g" },
    ];

    const availableNutrition = nutritionItems.filter(
        (item) => nutritionalInfo[item.key]
    );

    if (availableNutrition.length === 0) {
        return null;
    }

    return (
        <View
            style={styles.nutritionalSection}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Nutritional Information</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Nutritional Cards */}
            <View style={styles.nutritionalCard}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons
                        name="nutrition"
                        size={18}
                        color="#ffffff"
                    />
                    <Text style={styles.cardHeaderText}>Per Serving</Text>
                </View>

                <View style={styles.nutritionGrid}>
                    {availableNutrition.map((item, index) => (
                        <View key={index} style={styles.nutritionItem}>
                            <View style={styles.nutritionIconContainer}>
                                <MaterialCommunityIcons
                                    name={item.icon as any}
                                    size={20}
                                    color="#646f7e"
                                />
                            </View>
                            <Text style={styles.nutritionLabel}>
                                {item.label}
                            </Text>
                            <Text style={styles.nutritionValue}>
                                {nutritionalInfo[item.key]} {item.unit}
                            </Text>
                        </View>
                    ))}
                </View>

                {Object.keys(nutritionalInfo).some(
                    (key) => !nutritionItems.find((item) => item.key === key)
                ) && (
                    <View style={styles.additionalInfo}>
                        <Text style={styles.additionalTitle}>
                            Additional Info:
                        </Text>
                        {Object.entries(nutritionalInfo).map(
                            ([key, value], index) => {
                                if (
                                    !nutritionItems.find(
                                        (item) => item.key === key
                                    )
                                ) {
                                    return (
                                        <Text
                                            key={index}
                                            style={styles.additionalText}
                                        >
                                            {key.charAt(0).toUpperCase() +
                                                key.slice(1)}
                                            : {value}
                                        </Text>
                                    );
                                }
                                return null;
                            }
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    nutritionalSection: {
        marginBottom: 25,
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
    nutritionalCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
        overflow: "hidden",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cardHeaderText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 8,
        fontFamily: "SfProMedium",
    },
    nutritionGrid: {
        padding: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    nutritionItem: {
        width: "48%",
        alignItems: "center",
        marginBottom: 16,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 8,
    },
    nutritionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(100,111,126,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    nutritionLabel: {
        fontSize: 12,
        color: "#ffffff",
        opacity: 0.7,
        textAlign: "center",
        marginBottom: 4,
        fontFamily: "SfProMedium",
    },
    nutritionValue: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        fontFamily: "SfProMedium",
    },
    additionalInfo: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
    },
    additionalTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 8,
        fontFamily: "SfProMedium",
    },
    additionalText: {
        fontSize: 13,
        color: "#ffffff",
        opacity: 0.7,
        marginBottom: 4,
        fontFamily: "SfProMedium",
    },
});

export default NutritionalInfoSection;
