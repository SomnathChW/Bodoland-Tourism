import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import {
    Feather,
    MaterialIcons,
    FontAwesome,
    FontAwesome6,
} from "@expo/vector-icons";

export const useIconRenderer = () => {
    const renderIcon = useCallback((iconName: string) => {
        switch (iconName) {
            case "user":
            case "phone":
            case "info":
            case "bell":
            case "settings":
            case "help-circle":
            case "log-out":
                return (
                    <Feather
                        name={iconName}
                        size={18}
                        color="#fff"
                        style={styles.menuItemIcon}
                    />
                );
            case "home":
                return (
                    <FontAwesome
                        name="home"
                        size={18}
                        color="#fff"
                        style={styles.menuItemIcon}
                    />
                );
            case "bowl-food":
                return (
                    <FontAwesome6
                        name="bowl-food"
                        size={18}
                        color="#fff"
                        style={styles.menuItemIcon}
                    />
                );
            case "headset":
                return (
                    <MaterialIcons
                        name="headset-mic"
                        size={18}
                        color="#fff"
                        style={styles.menuItemIcon}
                    />
                );
            case "shield":
                return (
                    <FontAwesome
                        name="shield"
                        size={18}
                        color="#fff"
                        style={styles.menuItemIcon}
                    />
                );
            case "festival":
                return (
                    <MaterialIcons
                        name="festival"
                        size={18}
                        color="#fff"
                        style={styles.menuItemIcon}
                    />
                );
            default:
                return (
                    <Feather
                        name="circle"
                        size={18}
                        color="#fff"
                        style={styles.menuItemIcon}
                    />
                );
        }
    }, []);

    return renderIcon;
};

const styles = StyleSheet.create({
    menuItemIcon: {
        marginRight: 12,
    },
});
