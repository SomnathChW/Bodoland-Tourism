import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BackButtonProps {
    onPress: () => void;
    size?: number;
    color?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
    onPress,
    size = 24,
    color = "#000",
}) => {
    return (
        <TouchableOpacity onPress={onPress} hitSlop={20} activeOpacity={1}>
            <Ionicons name="arrow-back" size={size} color={color} />
        </TouchableOpacity>
    );
};

export default BackButton;
