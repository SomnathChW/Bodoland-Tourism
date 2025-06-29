import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MenuButtonProps {
    onPress: () => void;
    size?: number;
    color?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({
    onPress,
    size = 24,
    color = "#000",
}) => {
    return (
        <TouchableOpacity onPress={onPress} hitSlop={20} activeOpacity={1}>
            <Ionicons name="menu" size={size} color={color} />
        </TouchableOpacity>
    );
};

export default MenuButton;
