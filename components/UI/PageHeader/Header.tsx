import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useDrawer } from "@/context/DrawerContext";
import MenuButton from "@/components/UI/PageHeader/MenuButton";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BackButton from "./BackButton";

type HeaderProps = {
    buttonType?: "menu" | "back";
    headingText: string;
    subHeadingText: string;
    souvenir?: boolean;
    clearCart?: boolean;
    handleClearCart?: () => void;
};

const Header = ({
    buttonType = "menu",
    headingText,
    subHeadingText,
    souvenir,
    clearCart,
    handleClearCart,
}: HeaderProps) => {
    const { toggleDrawer } = useDrawer();
    const router = useRouter();

    const handleCartPress = () => {
        router.navigate({
            pathname: "/(protected)/cart",
        });
    };

    const handleOrdersPress = () => {
        router.navigate({
            pathname: "/(protected)/orders",
        });
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <View>
            <View style={styles.header}>
                <View style={styles.logo}>
                    {buttonType === "back" ? (
                        <BackButton
                            onPress={handleGoBack}
                            size={30}
                            color={styles.buttons.color}
                        />
                    ) : (
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                    )}
                    <View>
                        <Text style={styles.headingText}>{headingText}</Text>
                        <Text
                            style={styles.mainSubHeaddingText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {subHeadingText}
                        </Text>
                    </View>
                </View>

                {souvenir && (
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.orderButton}
                            onPress={handleOrdersPress}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name="shopping-bag"
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={handleCartPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="cart" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                {clearCart && handleClearCart && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearCart}
                    >
                        <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    buttons: {
        color: "#fff",
    },
    headingText: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        color: "#fff",
    },
    mainSubHeaddingText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#646f7e",
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    orderButton: {
        padding: 8,
    },
    cartButton: {
        padding: 8,
    },
    clearButton: {
        backgroundColor: "#ff4444",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    clearButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
});
