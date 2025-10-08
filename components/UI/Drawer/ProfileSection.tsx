import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Not memoized ProfileSection component
const ProfileSection = () => {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const userData = {
        name: user?.name || "",
        email: user?.email || "",
    };

    // Get user initials from name
    const getInitials = () => {
        if (!userData.name) return "?";
        const nameParts = userData.name
            .split(" ")
            .filter((part) => part.length > 0);
        if (nameParts.length === 0) return "?";
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        } else {
            return (
                nameParts[0].charAt(0) +
                nameParts[nameParts.length - 1].charAt(0)
            ).toUpperCase();
        }
    };

    return (
        <View style={[styles.profileSection, { paddingTop: insets.top + 10 }]}>
            <View style={styles.profileContent}>
                <View style={[styles.initialsAvatar]}>
                    <Text style={styles.initialsText}>{getInitials()}</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{userData.name}</Text>
                    <Text style={styles.profileEmail}>{userData.email}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileSection: {
        backgroundColor: "#1c2026",
    },
    profileContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        alignItems: "center",
    },
    profileInfo: {
        alignItems: "center",
    },
    profileName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 3,
        fontFamily: "SfProMedium",
    },
    profileEmail: {
        fontSize: 12,
        color: "#a0a0a0",
        marginBottom: 3,
        fontFamily: "SfProMedium",
    },
    initialsAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gray",
        marginBottom: 12,
    },
    initialsText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default ProfileSection;
