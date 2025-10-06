import React, { useEffect, useCallback, memo, useState, JSX } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Text,
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
import DrawerItem from "@/components/UI/Drawer/DrawerItem";
import ProfileSection from "@/components/UI/Drawer/ProfileSection";
import AlertDialog from "@/components/UI/AlertDialog";
import {
    drawerItems,
    drawerFooterItems,
    helpItems,
    DRAWER_ROUTES,
    getRouteByKey,
} from "@/constants/drawerItems";
import { useIconRenderer } from "./IconRenderer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH: number = width * 0.65;

function DrawerComponent(): JSX.Element {
    const { isDrawerOpen, toggleDrawer, currentPath } = useDrawer();
    const { signOut } = useAuth();
    const drawerProgress = useSharedValue(0);
    const router = useRouter();
    const renderIcon = useIconRenderer();
    const insets = useSafeAreaInsets();

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [lastPress, setLastPress] = useState(0);

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

    // Unified handler for menu, help, and footer items
    const handleNavigationItemPress = useCallback(
        (key: string, itemType: "menu" | "help" | "footer" = "menu") => {
            const now = Date.now();
            if (now - lastPress < 300) return; // debounce rapid taps
            setLastPress(now);

            // Handle logout actions
            if (itemType === "footer" && key === "logout") {
                handleLogoutDialog();
                return;
            }

            // Handle navigation
            const targetRoute = getRouteByKey(key);

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

            // Navigate first
            if (router.canGoBack() && !isInSomeOtherTab) {
                try {
                    router.dismissTo(targetRoute as any);
                } catch {
                    router.push(targetRoute as any);
                }
            } else {
                router.push(targetRoute as any);
            }

            // Close drawer after navigation has settled
            setTimeout(() => {
                drawerProgress.value = 0;
                toggleDrawer();
            }, 50);
        },
        [
            currentPath,
            toggleDrawer,
            router,
            drawerProgress,
            lastPress,
            handleLogoutDialog,
        ]
    );

    const handleMenuItemPress = useCallback(
        (key: string) => handleNavigationItemPress(key, "menu"),
        [handleNavigationItemPress]
    );

    const handleHelpItemPress = useCallback(
        (key: string) => handleNavigationItemPress(key, "help"),
        [handleNavigationItemPress]
    );

    const handleFooterItemPress = useCallback(
        (key: string) => handleNavigationItemPress(key, "footer"),
        [handleNavigationItemPress]
    );

    const isMenuItemActive = useCallback(
        (itemKey: string) => {
            const targetRoute = getRouteByKey(itemKey);
            if (!targetRoute) return false;
            if (currentPath === targetRoute) return true;

            if (targetRoute === DRAWER_ROUTES.home) {
                if (currentPath.startsWith("/(protected)/")) {
                    // Check if current path matches any OTHER specific route
                    const matchesAnyOtherRoute = Object.values(
                        DRAWER_ROUTES
                    ).some(
                        (route) =>
                            route !== DRAWER_ROUTES.home &&
                            currentPath.startsWith(route)
                    );

                    return !matchesAnyOtherRoute;
                }
            }
            return false;
        },
        [currentPath]
    );

    const isFooterOrMenuItemActive = useCallback(
        (itemKey: string) => {
            const route = getRouteByKey(itemKey);
            return route ? currentPath === route : false;
        },
        [currentPath]
    );

    return (
        <>
            <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
                <TouchableOpacity
                    style={styles.overlayTouch}
                    activeOpacity={1}
                    onPress={toggleDrawer}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.drawer,
                    drawerAnimatedStyle,
                    { paddingBottom: insets.bottom },
                ]}
            >
                <ProfileSection />

                <ScrollView
                    style={styles.drawerContent}
                    showsVerticalScrollIndicator={false}
                >
                    {drawerItems.map((item) => (
                        <DrawerItem
                            key={item.key}
                            item={item}
                            isActive={isMenuItemActive(item.key)}
                            onPress={handleMenuItemPress}
                            renderIcon={renderIcon}
                        />
                    ))}

                    <View
                        style={{
                            paddingHorizontal: 20,
                            height: 2,
                            backgroundColor: "#a0a0a0",
                            marginTop: 30,
                        }}
                    />

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>
                            HELP & SUPPORT
                        </Text>
                    </View>

                    {helpItems.map((item) => (
                        <DrawerItem
                            key={item.key}
                            item={item}
                            isActive={isFooterOrMenuItemActive(item.key)}
                            onPress={handleHelpItemPress}
                            renderIcon={renderIcon}
                        />
                    ))}

                    <View style={styles.scrollBottomPadding} />
                </ScrollView>

                <View style={styles.drawerFooter}>
                    {drawerFooterItems.map((item) => (
                        <DrawerItem
                            key={item.key}
                            item={item}
                            isActive={isFooterOrMenuItemActive(item.key)}
                            renderIcon={renderIcon}
                            onPress={handleFooterItemPress}
                        />
                    ))}
                </View>
            </Animated.View>

            <AlertDialog
                visible={showLogoutDialog}
                title="Sign Out?"
                description={"Are you sure you want to sign out?"}
                buttons={[
                    {
                        text: "No, Cancel",
                        onPress: handleLogoutDialog,
                        type: "cancel",
                    },
                    {
                        text: "Yes",
                        onPress: handleSignOut,
                        type: "secondary",
                    },
                ]}
                onCancel={handleLogoutDialog}
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
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
