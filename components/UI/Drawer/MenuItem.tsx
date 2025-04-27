import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface MenuItemProps {
    item: { key: string; label: string; icon: string };
    isActive: boolean;
    onPress: (key: string) => void;
    renderIcon: (iconName: string) => React.ReactNode;
}

const MenuItem = memo(
    ({ item, isActive, onPress, renderIcon }: MenuItemProps) => {
        return (
            <TouchableOpacity
                key={item.key}
                style={[styles.menuItem, isActive && styles.activeMenuItem]}
                activeOpacity={0.8}
                onPress={() => onPress(item.key)}
            >
                {renderIcon(item.icon)}
                <Text
                    style={[
                        styles.menuItemText,
                        isActive && styles.activeMenuItemText,
                    ]}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    }
);

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        backgroundColor: "transparent",
    },
    activeMenuItem: {
        backgroundColor: "#1e252e",
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    menuItemIcon: {
        marginRight: 12,
    },
    menuItemText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "SfProMedium",
        fontWeight: "bold",
    },
    activeMenuItemText: {
        color: "white",
    },
});

export default MenuItem;
