import React, { useEffect, useCallback, memo, useState } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Platform,
    Text,
    Linking,
} from "react-native";
import { useDrawer } from "@/context/DrawerContext";
import { useAuth } from "@/context/AuthContext";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

// Import separated components
import MenuItem from "@/components/UI/Drawer/MenuItem";
import FooterItem from "@/components/UI/Drawer/FooterItem";
import ProfileSection from "@/components/UI/Drawer/ProfileSection";
import AlertDialog from "@/components/UI/AlertDialog";
import {
    drawerItems,
    drawerFooterItems,
    helpItems,
    DRAWER_ROUTES,
    getRouteByKey,
    getHelpRoutes,
} from "@/constants/DrawerItems";
import { useIconRenderer } from "./IconRenderer";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH: number = width * 0.65;
const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

function DrawerComponent(): JSX.Element {
    const { isDrawerOpen, toggleDrawer, currentPath } = useDrawer();
    const { signOut } = useAuth();
    const drawerProgress = useSharedValue(0);
    const router = useRouter();
    const renderIcon = useIconRenderer();

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogoutDialog = () => {
        setShowLogoutDialog(!showLogoutDialog);
    };

    const handleSignOut = async () => {
        handleLogoutDialog();
        await signOut();
    };

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

    // Unified handler for both menu and help items
    const handleNavigationItemPress = useCallback(
        (key: string, itemType: "menu" | "help" = "menu") => {
            console.log("Selected item:", key);
            // Handle external links for help items
            if (itemType === "help" && key === "help") {
                const helpCenterUrl = "https://example.com/help-center"; // Replace with actual URL
                Linking.openURL(helpCenterUrl).catch((err) =>
                    console.error("Failed to open help center URL:", err)
                );
                toggleDrawer();
                return;
            }

            // Get the target route using centralized mapping
            const targetRoute = getRouteByKey(key);

            // Validate that we have a valid route
            if (!targetRoute) {
                console.warn(
                    `No valid route found for ${itemType} item: ${key}`
                );
                toggleDrawer();
                return;
            }

            const isInSomeOtherTab = [
                "attractions",
                "stays",
                "souvenirs",
                "virtual_tours",
            ].some((path) => currentPath.includes(path));

            if (targetRoute === currentPath) {
                toggleDrawer();
                return;
            }

            if (isInSomeOtherTab && targetRoute === "/(protected)/") {
                toggleDrawer();
                return;
            }

            if (router.canGoBack() && !isInSomeOtherTab) {
                try {
                    router.dismissTo(targetRoute as any);
                } catch {
                    router.push(targetRoute as any);
                }
            } else {
                router.push(targetRoute as any);
            }
            drawerProgress.value = 0;
            toggleDrawer();
        },
        [currentPath, toggleDrawer, router, drawerProgress]
    );

    // Wrapper for menu items
    const handleMenuItemPress = useCallback(
        (key: string) => handleNavigationItemPress(key, "menu"),
        [handleNavigationItemPress]
    );

    // Wrapper for help items
    const handleHelpItemPress = useCallback(
        (key: string) => handleNavigationItemPress(key, "help"),
        [handleNavigationItemPress]
    );

    const handleFooterItemPress = useCallback(
        (key: string) => {
            if (key === "logout") {
                handleLogoutDialog();
            } else if (key === "privacy") {
                // Open privacy policy link
                const privacyPolicyUrl = "https://example.com/privacy-policy"; // Replace with actual URL
                Linking.openURL(privacyPolicyUrl).catch((err) =>
                    console.error("Failed to open privacy policy URL:", err)
                );
                toggleDrawer();
            } else {
                console.log(`Selected footer: ${key}`);
                toggleDrawer();
            }
        },
        [toggleDrawer, handleLogoutDialog]
    );

    const isMenuItemActive = useCallback(
        (itemKey: string) => {
            const targetRoute = getRouteByKey(itemKey);

            if (!targetRoute) return false;

            if (currentPath === targetRoute) {
                return true;
            }

            if (targetRoute === DRAWER_ROUTES.home) {
                if (currentPath.startsWith("/(protected)/")) {
                    // Check if current path matches any other main drawer item
                    const matchesOtherMenuItem = Object.values(
                        DRAWER_ROUTES
                    ).some(
                        (route) =>
                            route !== DRAWER_ROUTES.home &&
                            currentPath.startsWith(route)
                    );

                    // Check if current path matches any help item route
                    const helpRoutes = getHelpRoutes();
                    const matchesHelpItem = helpRoutes.some(
                        (route) => currentPath === route
                    );

                    return !matchesOtherMenuItem && !matchesHelpItem;
                }
            }
            return false;
        },
        [currentPath]
    );

    const isHelpItemActive = useCallback(
        (itemKey: string) => {
            const route = getRouteByKey(itemKey);
            return route ? currentPath === route : false;
        },
        [currentPath]
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

                {/* User Profile Section */}
                <ProfileSection />

                {/* Scrollable Content */}
                <ScrollView
                    style={styles.drawerContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Main Menu Items */}
                    {drawerItems.map((item) => (
                        <MenuItem
                            key={item.key}
                            item={item}
                            isActive={isMenuItemActive(item.key)}
                            onPress={handleMenuItemPress}
                            renderIcon={renderIcon}
                        />
                    ))}

                    {/* Divider with horizontal padding */}
                    <View
                        style={{
                            paddingHorizontal: 20,
                            height: 2,
                            backgroundColor: "#a0a0a0",
                            marginTop: 30,
                        }}
                    />

                    {/* Help Items Section with title */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>
                            HELP & SUPPORT
                        </Text>
                    </View>

                    {helpItems.map((item) => (
                        <MenuItem
                            key={item.key}
                            item={item}
                            isActive={isHelpItemActive(item.key)}
                            onPress={handleHelpItemPress}
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
                            onPress={handleFooterItemPress}
                        />
                    ))}
                </View>
            </Animated.View>

            {/* Logout AlertDialog */}
            <AlertDialog
                visible={showLogoutDialog}
                title="Sign Out"
                description="Are you sure you want to sign out?"
                onCancel={handleLogoutDialog}
                onConfirm={handleSignOut}
            />
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
    drawerContent: {
        flex: 1,
        padding: 12,
    },
    scrollBottomPadding: {
        height: 20,
    },
    drawerFooter: {
        borderTopWidth: 2,
        borderTopColor: "#a0a0a0",
        padding: 12,
    },
    sectionHeader: {
        paddingVertical: 12,
    },
    sectionHeaderText: {
        fontSize: 12,
        color: "#a0a0a0",
        fontWeight: "bold",
        letterSpacing: 1,
        fontFamily: "SfProMedium",
    },
});
