import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
} from "react-native";
import { useDrawer } from "@/context/DrawerContext";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH: number = width * 0.6;

export default function Drawer(): JSX.Element {
    const { isDrawerOpen, toggleDrawer } = useDrawer();

    const drawerProgress = useSharedValue(0);

    useEffect(() => {
        drawerProgress.value = withTiming(isDrawerOpen ? 1 : 0, {
            duration: 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [isDrawerOpen]);

    const drawerAnimatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            drawerProgress.value,
            [0, 1],
            [-DRAWER_WIDTH, 0],
            Extrapolate.CLAMP
        );

        return {
            transform: [{ translateX }],
        };
    });

    const overlayAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: drawerProgress.value,
            display: drawerProgress.value === 0 ? "none" : "flex",
        };
    });

    return (
        <>
            <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
                <TouchableOpacity
                    style={styles.overlayTouch}
                    activeOpacity={1}
                    onPress={toggleDrawer}
                />
            </Animated.View>

            <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
                <View style={styles.drawerContent}>
                    <Text style={styles.drawerTitle}>Menu</Text>
                    {/* Add your drawer menu items here */}
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Profile</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1,
    },
    overlayTouch: {
        width: "100%",
        height: "100%",
    },
    drawer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: DRAWER_WIDTH,
        height: "100%",
        backgroundColor: "#0d1116",
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    drawerContent: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    drawerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#fff",
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuItemText: {
        color: "#fff",
    },
});
