import React, { useEffect, useCallback, memo } from "react";
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
import * as SecureStore from "expo-secure-store";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import {
    Feather,
    MaterialIcons,
    FontAwesome,
    FontAwesome6,
} from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH: number = width * 0.65;
const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

const drawerItems = [
    {
        label: "Home",
        key: "/(protected)/",
        icon: "home",
    },
    {
        label: "Festivals",
        key: "/(protected)/festivals",
        icon: "festival",
    },
    {
        label: "Cuisine",
        key: "/(protected)/cuisine",
        icon: "bowl-food",
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

// Memoized MenuItem component
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

// Memoized FooterItem component
interface FooterItemProps {
    item: { key: string; label: string; icon: string };
    renderIcon: (iconName: string) => React.ReactNode;
}

const FooterItem = memo(({ item, renderIcon }: FooterItemProps) => {
    return (
        <TouchableOpacity
            key={item.key}
            style={styles.footerItem}
            activeOpacity={0.8}
            onPress={() => console.log(`Selected footer: ${item.key}`)}
        >
            {renderIcon(item.icon)}
            <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
    );
});

// Memoized ProfileSection component
const ProfileSection = memo(() => {
    const user = SecureStore.getItem("user");
    const user_json = JSON.parse(user || "{}");

    const name = user_json.name || "";
    const email = user_json.email || "";

    // Get user initials from name
    const getInitials = () => {
        if (!name) return "?";
        const nameParts = name
            .split(" ")
            .filter((part: string | any[]) => part.length > 0);
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
        <View style={styles.profileSection}>
            <View style={styles.profileContent}>
                <View style={[styles.initialsAvatar]}>
                    <Text style={styles.initialsText}>{getInitials()}</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{name}</Text>
                    <Text style={styles.profileEmail}>{email}</Text>
                </View>
            </View>
        </View>
    );
});

function DrawerComponent(): JSX.Element {
    const { isDrawerOpen, toggleDrawer, currentPath } = useDrawer();
    const drawerProgress = useSharedValue(0);
    const router = useRouter();

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

    const renderIcon = useCallback((iconName: string) => {
        switch (iconName) {
            case "</Text>user":
            case "phone":
            case "info":
            case "bell":
            case "settings":
            case "help-circle":
            case "log-out":
                return (
                    <Feather
                        // @ts-ignore
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

    const handleMenuItemPress = useCallback(
        (key: string) => {
            if (!key.startsWith("/")) {
                console.log(`Selected item: ${key}`);
                toggleDrawer();
                return;
            }

            const isInSomeOtherTab = [
                "attractions",
                "stays",
                "souvenirs",
                "vrview",
            ].some((path) => currentPath.includes(path));

            if (key === currentPath) {
                toggleDrawer();
                return;
            }

            if (isInSomeOtherTab && key === "/(protected)/") {
                toggleDrawer();
                return;
            }

            if (router.canGoBack() && !isInSomeOtherTab) {
                try {
                    router.dismissTo(key as any);
                } catch {
                    router.push(key as any);
                }
            } else {
                router.push(key as any);
            }
            drawerProgress.value = 0;
            toggleDrawer();
        },
        [currentPath, toggleDrawer, router, drawerProgress]
    );

    const isMenuItemActive = useCallback(
        (itemKey: string) => {
            if (currentPath === itemKey) {
                return true;
            }
            if (itemKey === "/(protected)/") {
                if (currentPath.startsWith("/(protected)/")) {
                    const matchesOtherMenuItem = drawerItems.some(
                        (item) =>
                            item.key !== "/(protected)/" &&
                            currentPath.startsWith(item.key)
                    );
                    return !matchesOtherMenuItem;
                }
            }
            return false;
        },
        [currentPath, drawerItems]
    );

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
                <ProfileSection />

                {/* Scrollable Menu Items */}
                <ScrollView
                    style={styles.drawerContent}
                    showsVerticalScrollIndicator={false}
                >
                    {drawerItems.map((item) => (
                        <MenuItem
                            key={item.key}
                            item={item}
                            isActive={isMenuItemActive(item.key)}
                            onPress={handleMenuItemPress}
                            renderIcon={renderIcon}
                        />
                    ))}
                    {/* Add extra padding at the bottom to prevent cutoff */}
                    <View style={styles.scrollBottomPadding} />
                </ScrollView>

                {/* Sticky Footer */}
                <View style={styles.drawerFooter}>
                    {drawerFooterItems.map((item) => (
                        <FooterItem
                            key={item.key}
                            item={item}
                            renderIcon={renderIcon}
                        />
                    ))}
                </View>
            </Animated.View>
        </>
    );
}

const Drawer = memo(DrawerComponent);

export default Drawer;

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
        // borderBottomWidth: 1,
        // borderBottomColor: "rgba(255, 255, 255, 0.15)",
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
