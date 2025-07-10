import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ButtonProps {
    text: string;
    onPress: () => void;
    type?: "primary" | "secondary" | "cancel";
    disabled?: boolean;
}

interface CustomAlertDialogProps {
    visible: boolean;
    title: string;
    description: string;
    buttons: ButtonProps[];
    onCancel?: () => void;
}

const CustomAlertDialog = ({
    visible,
    title,
    description,
    buttons,
    onCancel,
}: CustomAlertDialogProps) => {
    // Validate button count (min 1, max 3)
    const validButtons = buttons.slice(0, 3);

    // Ensure we have at least one button
    if (validButtons.length === 0) {
        validButtons.push({
            text: "OK",
            onPress: onCancel || (() => {}),
            type: "primary",
        });
    }

    return (
        <>
            {visible ? (
                <View
                    style={{
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                    }}
                >
                    <Modal
                        transparent
                        visible={visible}
                        animationType="fade"
                        style={{ margin: 0 }}
                        onRequestClose={onCancel}
                    >
                        <View style={styles.overlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.title}>{title}</Text>
                                <Text style={styles.description}>
                                    {description}
                                </Text>
                                <View
                                    style={styles.buttonContainer}
                                >
                                    {validButtons.map((button, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.button,
                                                button.type === "primary" &&
                                                    styles.primaryButton,
                                                button.type === "secondary" &&
                                                    styles.primaryButton,
                                                button.type === "cancel" &&
                                                    styles.cancelButton,
                                                button.disabled &&
                                                    styles.disabledButton,
                                            ]}
                                            onPress={button.onPress}
                                            disabled={button.disabled}
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    button.type === "primary" &&
                                                        styles.primaryText,
                                                    button.type ===
                                                        "secondary" &&
                                                        styles.primaryText,
                                                    button.type === "cancel" &&
                                                        styles.cancelText,
                                                    button.disabled &&
                                                        styles.disabledText,
                                                ]}
                                            >
                                                {button.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#181818",
        padding: 20,
        borderRadius: 8,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        fontFamily: "SfProMedium",
    },
    description: {
        color: "#a0a0a0",
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
        fontFamily: "SfProRegular",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        borderWidth: 1,
    },
    primaryButton: {
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    cancelButton: {
        backgroundColor: "#181818",
        borderColor: "rgba(255, 255, 255, 0.19)",
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "SfProMedium",
    },
    primaryText: {
        color: "#000",
    },
    cancelText: {
        color: "#fff",
        fontFamily: "SfProMedium",
    },
    disabledText: {
        opacity: 0.7,
    },
});

export default CustomAlertDialog;
