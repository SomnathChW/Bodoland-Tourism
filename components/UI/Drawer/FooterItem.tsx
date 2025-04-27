import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface FooterItemProps {
    item: { key: string; label: string; icon: string };
    renderIcon: (iconName: string) => React.ReactNode;
    onPress?: (key: string) => void;
}

const FooterItem = memo(({ item, renderIcon, onPress }: FooterItemProps) => {
    const handlePress = () => {
        if (onPress) {
            onPress(item.key);
        } else {
            console.log(`Selected footer: ${item.key}`);
        }
    };

    return (
        <TouchableOpacity
            key={item.key}
            style={styles.footerItem}
            activeOpacity={0.8}
            onPress={handlePress}
        >
            {renderIcon(item.icon)}
            <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        marginBottom: 4,
        backgroundColor: "transparent",
    },
    menuItemText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "SfProMedium",
        fontWeight: "bold",
    },
});

export default FooterItem;
