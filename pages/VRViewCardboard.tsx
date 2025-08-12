import React, { useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Text,
    ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ViroVRSceneNavigator } from "@reactvision/react-viro";

import VRPhotoScene from "@/components/UI/VRScenes/VRPhotoScene";

const VRViewCardboard = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    // Get tourUrl from route parameters
    const tourUrl = params?.tourUrl as string;

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [sceneKey, setSceneKey] = useState(0); // Add scene key for forcing re-render
    const sceneNavigatorRef = useRef<any>(null);

    // Check if tourUrl is provided
    useEffect(() => {
        console.log("VR Cardboard: tourUrl received:", tourUrl);
        if (!tourUrl) {
            console.log(
                "VR Cardboard: No tourUrl provided, setting error state"
            );
            setIsLoading(false);
            setHasError(true);
        } else {
            console.log(
                "VR Cardboard: Valid tourUrl, proceeding with VR setup"
            );
        }
    }, [tourUrl]);

    // Handle screen focus - reload scene when returning from fullscreen mode
    useFocusEffect(
        React.useCallback(() => {
            console.log("VR Cardboard: Screen focused, tourUrl:", tourUrl);
            if (tourUrl) {
                console.log(
                    "VR Cardboard: Reloading scene with key:",
                    sceneKey + 1
                );
                // Force scene reload by updating the key
                setSceneKey((prev) => prev + 1);
                setIsLoading(true);
                setHasError(false);
            }
        }, [tourUrl])
    );

    const handleBack = () => {
        router.back();
    };

    const handleLoadStart = () => {
        setIsLoading(true);
        setHasError(false);
    };

    const handleLoadEnd = (event: any) => {
        setIsLoading(false);
    };

    const handleError = (event: any) => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Only render VR Navigator if we have a valid tourUrl */}
            {tourUrl && !hasError && (
                <ViroVRSceneNavigator
                    key={`cardboard-${sceneKey}`} // Force re-render with scene key
                    ref={sceneNavigatorRef}
                    initialScene={{
                        scene: () => (
                            <VRPhotoScene
                                handleLoadStart={handleLoadStart}
                                handleLoadEnd={handleLoadEnd}
                                handleError={handleError}
                                tourUrl={tourUrl}
                            />
                        ),
                    }}
                    style={styles.vrContainer}
                    vrModeEnabled={true}
                    autofocus={true}
                    viroAppProps={{
                        tourUrl: tourUrl,
                    }}
                />
            )}

            {/* Floating Back Button - Only visible, no cardboard button */}
            <View
                style={[
                    styles.floatingButtonsContainer,
                    { top: insets.top + 10 },
                ]}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.floatingBackButton}
                    onPress={handleBack}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Loading Overlay */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>
                        Loading VR Experience...
                    </Text>
                </View>
            )}

            {/* Error Overlay */}
            {hasError && (
                <View style={styles.errorOverlay}>
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={48} />
                        <Text style={styles.errorTitle}>
                            VR Experience Unavailable
                        </Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                setHasError(false);
                                setIsLoading(true);
                                // Force re-render the scene
                                if (sceneNavigatorRef.current) {
                                    sceneNavigatorRef.current.replace({
                                        scene: () => (
                                            <VRPhotoScene
                                                handleLoadStart={
                                                    handleLoadStart
                                                }
                                                handleLoadEnd={handleLoadEnd}
                                                handleError={handleError}
                                                tourUrl={tourUrl}
                                            />
                                        ),
                                    });
                                }
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.retryButtonText}>
                                Try Again
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleBack}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default VRViewCardboard;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    vrContainer: {
        flex: 1,
    },
    floatingButtonsContainer: {
        position: "absolute",
        left: 20,
        flexDirection: "row",
        gap: 12,
        zIndex: 10,
    },
    floatingBackButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
    },
    loadingText: {
        color: "white",
        fontSize: 16,
        fontFamily: "SfProMedium",
        marginTop: 16,
        textAlign: "center",
    },
    errorOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
        padding: 20,
    },
    errorContainer: {
        backgroundColor: "rgba(52, 52, 52, 0.8)",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        maxWidth: width * 0.8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    errorTitle: {
        color: "white",
        fontSize: 20,
        fontFamily: "SfProMedium",
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    errorMessage: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: "rgba(46, 204, 113, 0.8)",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 12,
        minWidth: 120,
    },
    retryButtonText: {
        color: "white",
        fontSize: 16,
        fontFamily: "SfProMedium",
        fontWeight: "600",
        textAlign: "center",
    },
    closeButton: {
        backgroundColor: "transparent",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        minWidth: 120,
    },
    closeButtonText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 16,
        fontFamily: "SfProMedium",
        textAlign: "center",
    },
});
