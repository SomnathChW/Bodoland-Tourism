import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDrawer } from "@/context/DrawerContext";
import MenuButton from "@/components/UI/PageHeader/MenuButton";

const Settings = () => {
    const { toggleDrawer } = useDrawer();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                        <View>
                            <Text style={styles.headingText}>Settings</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Manage your preferences
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.pageContent}>
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.description}>
                        This is the settings page of our application.
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    content: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "transparent",
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    headingText: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        fontFamily: "SF-Pro-Display-Medium",
    },
    mainSubHeaddingText: {
        fontSize: 14,
        color: "#8E8E93",
        fontFamily: "SF-Pro-Display-Medium",
    },
    buttons: {
        color: "white",
    },
    pageContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#8E8E93",
        textAlign: "center",
        lineHeight: 24,
    },
});
