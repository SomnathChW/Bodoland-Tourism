import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
    Camera,
    DefaultLight,
    FilamentScene,
    FilamentView,
    Model,
    Skybox,
    useCameraManipulator,
} from "react-native-filament";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { useSharedValue } from "react-native-worklets-core";

type SceneProps = {
    modelPath: string;
    skyBox?: string;
};

const Scene = ({ modelPath, skyBox }: SceneProps) => {
    const cameraManipulator = useCameraManipulator({
        orbitHomePosition: [0, 0, 8],
        targetPosition: [0, 0, 0],
        orbitSpeed: [0.008, 0.008],
    });

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
            cameraManipulator?.scroll(focalX, focalY, - delta * scaleMultiplier);
            previousScale.value = scale;
        });
    const combinedGesture = Gesture.Race(pinchGesture, panGesture);

    return (
        <GestureDetector gesture={combinedGesture}>
            <FilamentView style={styles.container}>
                <Skybox colorInHex={skyBox ?? "#000000"} />
                <Camera cameraManipulator={cameraManipulator} />
                <DefaultLight />

                <Model source={{ uri: modelPath }} transformToUnitCube />
            </FilamentView>
        </GestureDetector>
    );
};

type _3DViewProps = {
    modelPath?: string;
};

const _3DView = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const params = useLocalSearchParams<_3DViewProps>();
    const modelPath = params.modelPath;
    console.log("Model Path:", modelPath);

    const fallbackModelPath =
        "https://raw.githubusercontent.com/google/filament/main/third_party/models/DamagedHelmet/DamagedHelmet.glb";

    return (
        <View style={{ flex: 1 }}>
            <FilamentScene>
                <Scene modelPath={modelPath ?? fallbackModelPath} />
            </FilamentScene>
            {/* Floating Back Button */}
            <TouchableOpacity
                style={[styles.floatingBackButton, { top: insets.top + 10 }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Placeholder Text */}
            <View style={styles.container}>
                <Text style={styles.text}>3D View</Text>
            </View>
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
});
