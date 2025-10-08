import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface DrawerItemProps {
    item: { key: string; label: string; icon: string };
    isActive: boolean;
    onPress: (key: string) => void;
    renderIcon: (iconName: string) => React.ReactNode;
}

const DrawerItem = memo(
    ({ item, isActive, onPress, renderIcon }: DrawerItemProps) => {
        return (
            <TouchableOpacity
                key={item.key}
                style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
                activeOpacity={0.8}
                onPress={() => onPress(item.key)}
            >
                {renderIcon(item.icon)}
                <Text
                    style={[
                        styles.drawerItemText,
                        isActive && styles.activeDrawerItemText,
                    ]}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    }
);

const styles = StyleSheet.create({
    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        backgroundColor: "transparent",
    },
    activeDrawerItem: {
        backgroundColor: "#1e252e",
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    drawerItemIcon: {
        marginRight: 12,
    },
    drawerItemText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "SfProMedium",
        fontWeight: "bold",
    },
    activeDrawerItemText: {
        color: "white",
    },
});

export default DrawerItem;
