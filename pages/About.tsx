import { StyleSheet, Text, View, StatusBar } from "react-native";
import React from "react";
import { useDrawer } from "@/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import MenuButton from "@/components/UI/MenuButton";

const About = () => {
    const { toggleDrawer } = useDrawer();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                        <View>
                            <Text style={styles.headingText}>About</Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Learn about our application
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="search" size={30} style={styles.buttons} />
                </View>

                <View style={styles.pageContent}>
                    <Text style={styles.title}>About</Text>
                    <Text style={styles.description}>
                        This is the about page of our application.
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
        paddingTop: StatusBar.currentHeight,
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
