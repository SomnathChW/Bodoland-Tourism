import React, { useEffect, useCallback, memo } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    ScrollView,
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
import { useRouter } from "expo-router";

import MenuItem from "@/components/UI/Drawer/MenuItem";
import FooterItem from "@/components/UI/Drawer/FooterItem";
import ProfileSection from "@/components/UI/Drawer/ProfileSection";
import { drawerItems, drawerFooterItems } from "@/data/DrawerItems";
import { useIconRenderer } from "@/components/UI/Drawer/IconRenderer";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH: number = width * 0.65;
const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

function DrawerComponent(): JSX.Element {
    const { isDrawerOpen, toggleDrawer, currentPath } = useDrawer();
    const drawerProgress = useSharedValue(0);
    const router = useRouter();
    const renderIcon = useIconRenderer();

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

    const handleFooterItemPress = useCallback(
        (key: string) => {
            console.log(`Selected footer: ${key}`);
            // Add specific handling for footer items if needed
            toggleDrawer();
        },
        [toggleDrawer]
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
                            onPress={handleFooterItemPress}
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
    drawerContent: {
        flex: 1,
        padding: 12,
    },
    scrollBottomPadding: {
        height: 20,
    },
    drawerFooter: {
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.28)",
        padding: 12,
    },
});
