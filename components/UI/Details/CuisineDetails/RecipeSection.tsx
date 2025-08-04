import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Linking,
    TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

interface RecipeSectionProps {
    recipeUrl?: string;
}

const RecipeSection: React.FC<RecipeSectionProps> = ({ recipeUrl }) => {
    const handleRecipePress = () => {
        if (recipeUrl) {
            Linking.openURL(recipeUrl);
        }
    };

    if (!recipeUrl) {
        return null;
    }

    return (
        <View style={styles.recipeSection}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Recipe</Text>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* Recipe Card */}
            <TouchableWithoutFeedback onPress={handleRecipePress}>
                <View style={[styles.recipeCard, styles.recipeContent]}>
                    <View style={styles.recipeIconContainer}>
                        <MaterialCommunityIcons
                            name="chef-hat"
                            size={24}
                            color="#646f7e"
                        />
                    </View>
                    <View style={styles.recipeTextContainer}>
                        <Text style={styles.recipeTitle}>View Recipe</Text>
                        <Text style={styles.recipeDescription}>
                            Get the complete recipe and cooking instructions
                        </Text>
                    </View>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#646f7e"
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    recipeSection: {
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
    recipeCard: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#646f7e",
        overflow: "hidden",
    },
    recipeContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    recipeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(100,111,126,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    recipeTextContainer: {
        flex: 1,
    },
    recipeTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 4,
        fontFamily: "SfProMedium",
    },
    recipeDescription: {
        fontSize: 14,
        color: "#ffffff",
        opacity: 0.7,
        fontFamily: "SfProMedium",
    },
});

export default RecipeSection;
