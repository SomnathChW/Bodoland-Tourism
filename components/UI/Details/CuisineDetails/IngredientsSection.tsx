import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IngredientsSectionProps {
    ingredients?: string[];
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
    ingredients = [],
}) => {
    if (!ingredients || ingredients.length === 0) {
        return null;
    }

    return (
        <View
            style={styles.ingredientsSection}
        >
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Ingredients</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Ingredients Card */}
            <View style={styles.ingredientsCard}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons
                        name="food-variant"
                        size={18}
                        color="#ffffff"
                    />
                    <Text style={styles.cardHeaderText}>Main Ingredients</Text>
                </View>

                <View style={styles.ingredientsList}>
                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <View style={styles.ingredientBullet} />
                            <Text style={styles.ingredientText}>
                                {ingredient}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ingredientsSection: {
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
    ingredientsCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        paddingBottom: 8,
        marginBottom: 8,
    },
    cardHeaderText: {
        color: "#ffffff",
        fontFamily: "SfProMedium",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 8,
    },
    ingredientsList: {
        paddingTop: 8,
    },
    ingredientRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    ingredientBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#646f7e",
        marginRight: 12,
    },
    ingredientText: {
        fontSize: 14,
        color: "#ffffff",
        fontFamily: "SfProMedium",
        flex: 1,
    },
});

export default IngredientsSection;
