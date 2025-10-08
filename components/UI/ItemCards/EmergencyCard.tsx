import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Linking,
    TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import FastImageWLoader from "@/components/FastImageWLoader";
import { EmergencyContact } from "@/constants/emergencyNumbers";
import { LinearGradient } from "expo-linear-gradient";

interface EmergencyCardProps {
    item: EmergencyContact;
    index: number;
    width: number;
    height: number;
}

// Define colors for emergency services
const EMERGENCY_COLORS = {
    police: "#7dd3fc", // Sky blue
    fire: "#fb923c", // Orange
    ambulance: "#4ade80", // Green
};


// Calculate base dimensions
const PADDING = 15;
const GAP = 15;
const NUM_CARDS_ON_SCREEN = 2;

const EmergencyCard: React.FC<EmergencyCardProps> = React.memo(
    ({ item, index, width, height }) => {
        // Helper to open phone dialer
        const handlePress = (number: string) => {
            Linking.openURL(`tel:${number}`);
        };

        const CARD_WIDTH =
            (width - PADDING * 2 - GAP * (NUM_CARDS_ON_SCREEN - 1)) /
            NUM_CARDS_ON_SCREEN;

        return (
            <View
                style={{
                    width: CARD_WIDTH,
                    backgroundColor: "rgba(52, 52, 52, 0.35)",
                    borderRadius: 10,
                    overflow: "hidden",
                    shadowOffset: { width: 10, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    marginVertical: 8,
                    marginLeft: index % 2 === 0 ? PADDING : GAP / 2,
                    marginRight: index % 2 === 0 ? GAP / 2 : PADDING,
                }}
            >
                {/* Image section with text overlay */}
                <View style={styles.imageContainer}>
                    <FastImageWLoader
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.8)"]}
                        style={styles.imageOverlay}
                    >
                        <Text style={styles.districtTitle}>{item.name}</Text>
                        <Text style={styles.subtitle}>Emergency Services</Text>
                    </LinearGradient>
                </View>

                {/* Contact buttons section */}
                <View style={styles.contactsSection}>
                    <View style={styles.contactsContainer}>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => handlePress(item.police)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[
                                    "rgba(255, 255, 255, 0.02)",
                                    "rgba(255, 255, 255, 0.005)",
                                ]}
                                style={styles.buttonGradient}
                            >
                                <Ionicons
                                    name="shield-checkmark"
                                    size={14}
                                    color={EMERGENCY_COLORS.police}
                                />
                                <Text style={styles.contactText}>Police</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => handlePress(item.fire)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[
                                    "rgba(255, 255, 255, 0.02)",
                                    "rgba(255, 255, 255, 0.005)",
                                ]}
                                style={styles.buttonGradient}
                            >
                                <Ionicons
                                    name="flame"
                                    size={14}
                                    color={EMERGENCY_COLORS.fire}
                                />
                                <Text style={styles.contactText}>Fire</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => handlePress(item.ambulance)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[
                                    "rgba(255, 255, 255, 0.02)",
                                    "rgba(255, 255, 255, 0.005)",
                                ]}
                                style={styles.buttonGradient}
                            >
                                <FontAwesome5
                                    name="ambulance"
                                    size={12}
                                    color={EMERGENCY_COLORS.ambulance}
                                />
                                <Text style={styles.contactText}>
                                    Ambulance
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
);

export default EmergencyCard;

const styles = StyleSheet.create({
    card: {
        // Not used anymore - using inline styles
    },
    imageContainer: {
        position: "relative",
        height: 90,
    },
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: "#222",
    },
    imageOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        justifyContent: "flex-end",
    },
    districtTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 10,
        color: "rgba(255, 255, 255, 0.9)",
        fontFamily: "SF-Pro-Display-Medium",
        marginTop: 1,
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    contactsSection: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    contactsContainer: {
        flexDirection: "column",
        gap: 6,
    },
    contactButton: {
        borderRadius: 6,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(194, 194, 194, 0.1)",
    },
    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 6,
        minHeight: 32,
    },
    contactText: {
        fontSize: 10,
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
        marginLeft: 4,
        textAlign: "center",
    },
});
