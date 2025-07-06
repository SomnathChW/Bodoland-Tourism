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
import FastImage from "react-native-fast-image";
import { EmergencyContact } from "@/data/emergency_data";
import { LinearGradient } from "expo-linear-gradient";

interface EmergencyCardProps {
    item: EmergencyContact;
}

const { width } = Dimensions.get("window");

const EmergencyCard: React.FC<EmergencyCardProps> = ({ item }) => {
    // Helper to open phone dialer
    const handlePress = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <View style={styles.card}>
            {/* Image section with text overlay */}
            <View style={styles.imageContainer}>
                <FastImage
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.imageOverlay}
                >
                    <Text style={styles.districtTitle}>{item.title}</Text>
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
                                color="#666666"
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
                            <Ionicons name="flame" size={14} color="#666666" />
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
                                color="#666666"
                            />
                            <Text style={styles.contactText}>Ambulance</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default EmergencyCard;

const PADDING = 8;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(52, 52, 52, 0.35)",
        borderRadius: 10,
        marginHorizontal: PADDING,
        marginVertical: 8,
        overflow: "hidden",
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: (width - 48) / 2, // 48 = 16 (container padding) + 32 (total margin between cards)
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
