import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
    ViroARSceneNavigator,
    ViroARScene,
    ViroAmbientLight,
    ViroQuad,
    ViroMaterials,
    ViroARPlane,
    Viro3DObject,
} from "@reactvision/react-viro";
import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";
import LottieView from "lottie-react-native";

ViroMaterials.createMaterials({
    QuadMaterial: {
        lightingModel: "Constant",
        diffuseColor: "",
        blendMode: "Multiply",
        diffuseIntensity: 0.8,
    },
});

function ARScene({
    modelPath,
    onModelPlaced,
}: {
    modelPath?: string;
    onModelPlaced?: () => void;
}) {
    const [position, setPosition] = useState<Viro3DPoint | null>(null);

    return (
        <ViroARScene>
            <ViroAmbientLight color="white" />
            <ViroARPlane
                dragType="FixedToWorld"
                onAnchorFound={(anchor) => {
                    setTimeout(() => {
                        setPosition(anchor.position);
                        // Call the handler to hide lottie when model is placed
                        if (onModelPlaced) {
                            onModelPlaced();
                        }
                    }, 1000);
                }}
            >
                <Viro3DObject
                    visible={!!position}
                    source={{ uri: modelPath }}
                    position={[0, 0, 0]}
                    scale={[0.3, 0.3, 0.3]}
                    type="GLB"
                    dragType="FixedToWorld"
                    onDrag={() => {}}
                />
                <ViroQuad
                    visible={!position}
                    position={[0, 0, 0]}
                    width={1}
                    height={1}
                    rotation={[-90, 0, 0]}
                    materials="QuadMaterial"
                />
            </ViroARPlane>
        </ViroARScene>
    );
}

const ARView = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const params = useLocalSearchParams();
    const modelPath = params.modelPath;

    const [shouldShowLottie, setShouldShowLottie] = useState(true);

    const handleModelPlaced = () => {
        setShouldShowLottie(false);
    };

    const fallbackModelPath =
        "https://raw.githubusercontent.com/google/filament/main/third_party/models/DamagedHelmet/DamagedHelmet.glb";

    return (
        <View style={styles.container}>
            <ViroARSceneNavigator
                style={styles.arNavigator}
                initialScene={{
                    scene: () =>
                        ARScene({
                            modelPath:
                                (modelPath as string) || fallbackModelPath,
                            onModelPlaced: handleModelPlaced,
                        }),
                }}
            />
            {/* Floating Back Button */}
            <TouchableOpacity
                style={[styles.floatingBackButton, { top: insets.top + 10 }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Instructions */}
            {shouldShowLottie && (
                <View
                    style={[
                        styles.instructionsContainer,
                        { top: insets.top + 60 },
                    ]}
                >
                    <Text style={styles.instructionText}>
                        Point camera at a flat surface to detect plane
                    </Text>
                    <Text style={styles.instructionText}>
                        The model will appear once a plane is detected
                    </Text>
                </View>
            )}

            {/* AR Scan Lottie Animation */}
            {shouldShowLottie && (
                <LottieView
                    source={require("@/assets/lottie/ar-view.json")}
                    style={styles.lottieAnimation}
                    autoPlay
                    loop
                />
            )}
        </View>
    );
};

export default ARView;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: "#000000",
    },
    arNavigator: {
        width: "100%",
        height: "100%",
    },
    text: {
        color: "#ffffff",
        fontSize: 24,
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
    instructionsContainer: {
        position: "absolute",
        left: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        padding: 12,
        borderRadius: 8,
    },
    instructionText: {
        color: "#ffffff",
        fontSize: 14,
        textAlign: "center",
        marginVertical: 2,
    },
    helloWorldTextStyle: {
        fontFamily: "Arial",
        fontSize: 30,
        color: "#ffffff",
        textAlignVertical: "center",
        textAlign: "center",
    },
    lottieAnimation: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 300,
        height: 300,
        marginTop: -150,
        marginLeft: -150,
        backgroundColor: "transparent",
        zIndex: 5,
        pointerEvents: "none", // This allows touches to pass through
    },
});
