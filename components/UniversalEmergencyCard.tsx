import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
    Dimensions,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UniversalEmergencyService } from "@/data/emergency_data";

interface UniversalEmergencyCardProps {
    item: UniversalEmergencyService;
}

const { width } = Dimensions.get("window");

const UniversalEmergencyCard: React.FC<UniversalEmergencyCardProps> = ({
    item,
}) => {
    const handlePress = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item.number)}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={item.gradientColors}
                style={styles.cardGradient}
            >
                <View style={styles.iconContainer}>
                    {item.icon === "ambulance" ? (
                        <FontAwesome5
                            name="ambulance"
                            size={20}
                            color={item.color}
                        />
                    ) : (
                        <Ionicons
                            name={item.icon as any}
                            size={24}
                            color={item.color}
                        />
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.serviceNumber}>{item.number}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default UniversalEmergencyCard;

const styles = StyleSheet.create({
    card: {
        width: (width - 48) / 2, // 48 = 16 (container padding) + 32 (total margin between cards)
        marginHorizontal: 8,
        marginVertical: 6,
        borderRadius: 12,
        overflow: "hidden",
    },
    cardGradient: {
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 100,
        backgroundColor: "transparent",
    },
    iconContainer: {
        marginBottom: 8,
        backgroundColor: "transparent",
    },
    textContainer: {
        alignItems: "center",
        backgroundColor: "transparent",
    },
    serviceName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
        textAlign: "center",
        marginBottom: 4,
        backgroundColor: "transparent",
    },
    serviceNumber: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
        textAlign: "center",
        backgroundColor: "transparent",
    },
});
