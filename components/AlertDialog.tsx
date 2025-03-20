import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface AlertDialogProps {
    visible: boolean;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const AlertDialog = ({
    visible,
    title,
    description,
    cancelText = "Cancel",
    confirmText = "Continue",
    onCancel,
    onConfirm,
}: AlertDialogProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text
                                style={[styles.buttonText, styles.cancelText]}
                            >
                                {cancelText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.continueButton]}
                            onPress={onConfirm}
                        >
                            <Text
                                style={[styles.buttonText, styles.continueText]}
                            >
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
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
    },
    description: {
        color: "#a0a0a0",
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
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
    cancelButton: {
        backgroundColor: "#181818",
        borderColor: "#a0a0a0",
    },
    continueButton: {
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    cancelText: {
        color: "#fff",
    },
    continueText: {
        color: "#000",
    },
});

export default AlertDialog;
