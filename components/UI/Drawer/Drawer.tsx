import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    ScrollView,
    StatusBar,
    Platform,
} from "react-native";
import { useDrawer } from "@/context/DrawerContext";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH: number = width * 0.6;
const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

const drawerItems = [
    {
        label: "Profile",
        key: "profile",
        icon: "user",
    },
    {
        label: "Emergency Contacts",
        key: "emergency",
        icon: "phone",
    },
    {
        label: "About the State",
        key: "about",
        icon: "info",
    },
    // Add more items to test scrolling
    {
        label: "Notifications",
        key: "notifications",
        icon: "bell",
    },
    {
        label: "Settings",
        key: "settings",
        icon: "settings",
    },
    {
        label: "Help Center",
        key: "help",
        icon: "help-circle",
    },
];

const drawerFooterItems = [
    {
        label: "Feedback & Support",
        key: "support",
        icon: "headset",
    },
    {
        label: "Legal & Privacy Policy",
        key: "privacy",
        icon: "shield",
    },
    {
        label: "Logout",
        key: "logout",
        icon: "log-out",
    },
];

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
            Extrapolation.CLAMP
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

    const renderIcon = (iconName: string) => {
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
    };

    const randomUserNumber = Math.floor(Math.random() * 100);

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />

            <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
                <TouchableOpacity
                    style={styles.overlayTouch}
                    activeOpacity={1}
                    onPress={toggleDrawer}
                />
            </Animated.View>

            <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
                {/* Separate status bar space */}
                <View style={styles.statusBarSpacer} />

                {/* User Profile Section - naturally sized */}
                <View style={styles.profileSection}>
                    <View style={styles.profileContent}>
                        <FastImage
                            source={{
                                uri: `https://randomuser.me/api/portraits/men/${randomUserNumber}.jpg`,
                            }}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>
                                Somnath Chowdhury
                            </Text>
                            <Text style={styles.profileEmail}>
                                somnath@test.com
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Scrollable Menu Items */}
                <ScrollView
                    style={styles.drawerContent}
                    showsVerticalScrollIndicator={false}
                >
                    {drawerItems.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            style={styles.menuItem}
                            activeOpacity={0.8}
                            onPress={() => console.log(`Selected: ${item.key}`)}
                        >
                            {renderIcon(item.icon)}
                            <Text style={styles.menuItemText}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {/* Add extra padding at the bottom to prevent cutoff */}
                    <View style={styles.scrollBottomPadding} />
                </ScrollView>

                {/* Sticky Footer */}
                <View style={styles.drawerFooter}>
                    {drawerFooterItems.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            style={styles.footerItem}
                            activeOpacity={0.8}
                            onPress={() =>
                                console.log(`Selected footer: ${item.key}`)
                            }
                        >
                            {renderIcon(item.icon)}
                            <Text style={styles.menuItemText}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
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
    statusBarSpacer: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: "#1c2026",
    },
    profileSection: {
        backgroundColor: "#1c2026",
    },
    profileContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: "center",
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 12,
        borderWidth: 3,
        borderColor: "#4d95e3",
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
    scrollBottomPadding: {
        height: 20,
    },
    drawerContent: {
        flex: 1,
        padding: 12,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.15)",
        backgroundColor: "transparent",
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
    drawerFooter: {
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.28)",
        padding: 12,
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        marginBottom: 4,
        backgroundColor: "transparent",
    },
});
