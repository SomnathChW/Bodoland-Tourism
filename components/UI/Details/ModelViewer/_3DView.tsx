import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import {
    Camera,
    DefaultLight,
    FilamentScene,
    FilamentView,
    Model,
    ModelRenderer,
    Skybox,
    useCameraManipulator,
    useModel,
} from "react-native-filament";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { useSharedValue } from "react-native-worklets-core";

type SceneProps = {
    modelPath: string;
    skyBox?: string;
    onLoadingChange: (loading: boolean) => void;
};

const Scene = ({ modelPath, skyBox, onLoadingChange }: SceneProps) => {
    const cameraManipulator = useCameraManipulator({
        orbitHomePosition: [0, 0, 8],
        targetPosition: [0, 0, 0],
        orbitSpeed: [0.008, 0.008],
    });

    const model = useModel({ uri: modelPath });

    useEffect(() => {
        if (model.state === "loaded") {
            onLoadingChange(false);
        } else if (model.state === "loading") {
            onLoadingChange(true);
        }
    }, [model.state, onLoadingChange]);

    // Pan gesture
    const viewHeight = Dimensions.get("window").height;
    const sensitivityMultiplier = 1.25; // Added sensitivity multiplier for more responsive rotation
    const panGesture = Gesture.Pan()
        .onBegin((event) => {
            const yCorrected = viewHeight - event.translationY;
            cameraManipulator?.grabBegin(
                event.translationX * sensitivityMultiplier,
                yCorrected * sensitivityMultiplier,
                false
            );
        })
        .onUpdate((event) => {
            const yCorrected = viewHeight - event.translationY;
            cameraManipulator?.grabUpdate(
                event.translationX * sensitivityMultiplier,
                yCorrected * sensitivityMultiplier
            );
        })
        .maxPointers(1)
        .onEnd(() => {
            cameraManipulator?.grabEnd();
        });

    // Scale gesture
    const previousScale = useSharedValue(1);
    const scaleMultiplier = 500;
    const pinchGesture = Gesture.Pinch()
        .onBegin(({ scale }) => {
            previousScale.value = scale;
        })
        .onUpdate(({ scale, focalX, focalY }) => {
            const delta = scale - previousScale.value;
            cameraManipulator?.scroll(focalX, focalY, -delta * scaleMultiplier);
            previousScale.value = scale;
        });
    const combinedGesture = Gesture.Race(pinchGesture, panGesture);

    return (
        <GestureDetector gesture={combinedGesture}>
            <FilamentView style={styles.container}>
                <Skybox colorInHex={skyBox ?? "#000000"} />
                <Camera cameraManipulator={cameraManipulator} />
                <DefaultLight />

                <ModelRenderer model={model} transformToUnitCube />
            </FilamentView>
        </GestureDetector>
    );
};

type _3DViewProps = {
    modelPath?: string;
    souvenirName?: string;
    souvenirPrice?: string;
    souvenirDimensions?: string;
    currency?: string;
};

const _3DView = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isModelLoading, setIsModelLoading] = React.useState(true);

    const params = useLocalSearchParams<_3DViewProps>();
    const modelPath = params.modelPath;
    const souvenirName = params.souvenirName;
    const souvenirPrice = params.souvenirPrice;
    const souvenirDimensions = params.souvenirDimensions;

    let currency: string;
    if (params.currency === "INR") {
        currency = "₹";
    } else if (params.currency === "USD") {
        currency = "$";
    } else {
        currency = params.currency ?? "";
    }

    const fallbackModelPath =
        "https://raw.githubusercontent.com/google/filament/main/third_party/models/DamagedHelmet/DamagedHelmet.glb";

    const handleLoadingChange = React.useCallback((loading: boolean) => {
        setIsModelLoading(loading);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FilamentScene>
                <Scene
                    modelPath={modelPath ?? fallbackModelPath}
                    onLoadingChange={handleLoadingChange}
                />
            </FilamentScene>

            {/* Loading Indicator Overlay */}
            {isModelLoading && (
                <View style={styles.loadingOverlay}>
                    <LottieView
                        source={require("@/assets/lottie/loading-spinner.json")}
                        autoPlay
                        loop
                        style={styles.loadingAnimation}
                    />
                    <Text style={styles.loadingText}>Loading 3D Model...</Text>
                </View>
            )}

            {/* Floating Back Button */}
            <TouchableOpacity
                style={[styles.floatingBackButton, { top: insets.top + 10 }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Souvenir Info Overlay */}
            {souvenirName && (
                <View style={styles.infoOverlay}>
                    <Text style={styles.souvenirName}>{souvenirName}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.priceText}>
                            {currency} {souvenirPrice}
                        </Text>
                        {souvenirDimensions && (
                            <Text style={styles.dimensionsText}>
                                {souvenirDimensions}
                            </Text>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};

export default _3DView;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
    },
    text: {
        color: "#ffffff",
        fontSize: 24,
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
    loadingAnimation: {
        width: 100,
        height: 100,
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "SfProMedium",
        marginTop: 20,
    },
    floatingBackButton: {
        position: "absolute",
        left: 20,
        zIndex: 15,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    infoOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(67, 92, 112, 0.7)",
        borderRadius: 12,
        padding: 16,
        zIndex: 25,
    },
    souvenirName: {
        color: "#ffffff",
        fontSize: 18,
        fontFamily: "SfProMedium",
        fontWeight: "bold",
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceText: {
        color: "#4CAF50",
        fontSize: 16,
        fontFamily: "SfProMedium",
        fontWeight: "600",
    },
    dimensionsText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        fontFamily: "SfProMedium",
    },
});
