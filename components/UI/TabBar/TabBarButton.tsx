import { Text, Pressable, StyleSheet } from "react-native";
import React, { memo, useEffect } from "react";
import { icons } from "@/constants/icons";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const TabBarButton = memo(
    ({
        onPress,
        onLongPress,
        isFocused,
        routeName,
        label,
        color,
    }: {
        onPress: any;
        onLongPress: any;
        isFocused: boolean;
        routeName: string;
        color: string;
        label: string;
    }) => {
        const focused = useSharedValue(isFocused ? 1 : 0);

        useEffect(() => {
            focused.value = withSpring(
                typeof isFocused === "boolean"
                    ? isFocused
                        ? 1
                        : 0
                    : isFocused,
                {
                    duration: 300,
                }
            );
        }, [focused, isFocused]);

        const animatedTextStyles = useAnimatedStyle(() => {
            const opacity = interpolate(focused.value, [0, 1], [1, 0]);
            return {
                opacity,
            };
        }, []);

        const animatedIconStyles = useAnimatedStyle(() => {
            const scaleValue = interpolate(focused.value, [0, 1], [1, 1.2]);
            const top = interpolate(focused.value, [0, 1], [0, 8]);
            return {
                transform: [{ scale: scaleValue }],
                top,
            };
        }, []);

        const animatedTabSelector = useAnimatedStyle(() => {
            const width = interpolate(focused.value, [0, 1], [0, 24]);
            return {
                width,
                height: 5,
            };
        }, []);

        // Pre-render the icon to avoid recreation on each render
        const IconComponent = icons[routeName as keyof typeof icons];

        return (
            <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabBarItem}
            >
                <Animated.View
                    style={[
                        animatedTabSelector,
                        { backgroundColor: "white", borderRadius: 5 },
                    ]}
                />
                <Animated.View style={animatedIconStyles}>
                    <IconComponent size={24} color={color} />
                </Animated.View>
                <Animated.Text
                    style={[animatedTextStyles, styles.tabBarText, { color }]}
                >
                    {label}
                </Animated.Text>
            </Pressable>
        );
    }
);

export default TabBarButton;

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    tabBarText: {
        fontSize: 12,
        fontFamily: "SfProMedium",
    },
});
