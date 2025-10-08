import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/UI/PageHeader/Header";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { toast } from "sonner-native";

const Feedback = () => {
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState("");
    const [feedback, setFeedback] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        try {
            // Request permission
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                toast.error(
                    "Please allow access to your photo library to upload images."
                );
                return;
            }

            // Launch image picker with crop enabled
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 0.7,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets[0]) {
                setImages((prev) => [...prev, result.assets[0].uri]);
            }
        } catch (error) {
            toast.error("Failed to pick image. Please try again.");
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validation
        if (!title.trim()) {
            toast.error("Please enter a title for your feedback.");
            return;
        }

        if (!feedback.trim()) {
            toast.error("Please enter your feedback message.");
            return;
        }

        setIsSubmitting(true);

        // Simulate submission (replace with actual API call)
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success(
                "Thank you for your feedback! We appreciate your input."
            );

            // Reset form
            setTitle("");
            setFeedback("");
            setImages([]);
        }, 1500);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                headingText="Feedback"
                subHeadingText="Share your thoughts and suggestions"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Title Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Enter feedback title"
                        placeholderTextColor="#8E8E93"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                        cursorColor="white"
                    />
                </View>

                {/* Feedback Text Area */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Your Feedback</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Share your thoughts, suggestions, and experiences..."
                        placeholderTextColor="#8E8E93"
                        value={feedback}
                        onChangeText={setFeedback}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        maxLength={1000}
                        cursorColor="white"
                    />
                    <Text style={styles.charCount}>{feedback.length}/1000</Text>
                </View>

                {/* Image Upload Section */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Attachments (Optional)</Text>
                    <Text style={styles.helperText}>
                        Add images to help illustrate your feedback
                    </Text>

                    {/* Image Grid */}
                    {images.length > 0 && (
                        <View style={styles.imageGrid}>
                            {images.map((uri, index) => (
                                <View key={index} style={styles.imageContainer}>
                                    <Image
                                        source={{ uri }}
                                        style={styles.image}
                                    />
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={24}
                                            color="#e74c3c"
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Add Image Button */}
                    {images.length < 5 && (
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={pickImage}
                        >
                            <Ionicons
                                name="camera-outline"
                                size={24}
                                color="#646f7e"
                            />
                            <Text style={styles.uploadButtonText}>
                                {images.length === 0
                                    ? "Add Photos"
                                    : `Add More (${images.length}/5)`}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        isSubmitting && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Ionicons name="send" size={20} color="white" />
                            <Text style={styles.submitButtonText}>
                                Submit Feedback
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Feedback;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        marginBottom: 8,
        fontFamily: "SF-Pro-Display-Semibold",
    },
    helperText: {
        fontSize: 13,
        color: "#646f7e",
        marginBottom: 12,
        fontFamily: "SF-Pro-Display-Regular",
    },
    titleInput: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "white",
        borderWidth: 1,
        borderColor: "#2c3440",
        fontFamily: "SF-Pro-Display-Regular",
    },
    textArea: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "white",
        borderWidth: 1,
        borderColor: "#2c3440",
        minHeight: 150,
        fontFamily: "SF-Pro-Display-Regular",
    },
    charCount: {
        fontSize: 12,
        color: "#646f7e",
        textAlign: "right",
        marginTop: 4,
        fontFamily: "SF-Pro-Display-Regular",
    },
    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 12,
    },
    imageContainer: {
        position: "relative",
        width: 100,
        height: 100,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        backgroundColor: "#1a2029",
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#0d1116",
        borderRadius: 12,
    },
    uploadButton: {
        backgroundColor: "#1a2029",
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: "#646f7e",
        borderStyle: "dashed",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    uploadButtonText: {
        color: "#646f7e",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "SF-Pro-Display-Semibold",
    },
    submitButton: {
        backgroundColor: "#646f7e",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 16,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "SF-Pro-Display-Semibold",
    },
});
