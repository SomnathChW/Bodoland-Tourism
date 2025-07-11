import React, { useEffect } from "react";
// import {
//     Camera,
//     DefaultLight,
//     FilamentScene,
//     FilamentView,
//     Model,
//     Skybox,
//     useCameraManipulator,
// } from "react-native-filament";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { isARSupportedOnDevice } from "@reactvision/react-viro";
import { useVideoPlayer, VideoView } from "expo-video";

const modelPath =
    "https://fra.cloud.appwrite.io/v1/storage/buckets/model_placeholders/files/khopari/view?project=bodoland-tourism";
const VIDEO_URL =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// interface SceneProps {
//     model?: string;
//     scale?: number;
//     skyBox: string;
// }

// ! This component is currently not used in the app, but it can be used to render a 3D model scene with auto-rotation and camera manipulation. This causes a slight flicker on Android devices, so it is not recommended to use it in production without further optimization.

// function Scene({ model, scale = 8, skyBox }: SceneProps) {
//     const cameraManipulator = useCameraManipulator({
//         orbitHomePosition: [0, 2, -scale], // Camera positioned slightly above (Y=2) and at distance=scale
//         targetPosition: [0, -0.2, 0], // Looking slightly down at the model
//         orbitSpeed: [0.003, 0.003],
//     });

//     // Auto-rotation effect
//     useEffect(() => {
//         if (!cameraManipulator) return;

//         const rotationInterval = setInterval(() => {
//             // Slow auto-rotation around Y-axis
//             cameraManipulator.grabBegin(0, 0, false);
//             cameraManipulator.grabUpdate(1, 0); // Small rotation increment
//             cameraManipulator.grabEnd();
//         }, 50); // Adjust timing for rotation speed

//         return () => clearInterval(rotationInterval);
//     }, [cameraManipulator]);

//     return (
//         <FilamentView style={styles.container}>
//             <Skybox colorInHex={skyBox} />
//             <Camera cameraManipulator={cameraManipulator} />
//             <DefaultLight />
//             <Model
//                 source={{ uri: model ?? modelPath }}
//                 transformToUnitCube
//                 castShadow
//             />
//         </FilamentView>
//     );
// }

interface ModelViewerProps {
    bgColor?: string;
    scale?: number;
    model: string;
    videoUrl: string;
}

const checkARSupport = async () => {
    try {
        const result = await isARSupportedOnDevice();
        return result.isARSupported;
    } catch (error) {
        return false;
    }
};

export function ModelViewer({
    scale,
    model,
    bgColor,
    videoUrl,
}: ModelViewerProps) {
    const backgroundColor = bgColor ?? "#222222";
    const [isARSupported, setIsARSupported] = React.useState(false);
    const router = useRouter();

    console.log("ModelViewer props:", {
        scale,
        model,
        bgColor,
        videoUrl,
    });

    useEffect(() => {
        const checkAR = async () => {
            const supported = await checkARSupport();
            setIsARSupported(supported);
        };
        checkAR();
    }, []);

    const handleViewInRoom = () => {
        router.push({
            pathname: "/ar-view",
            params: { modelPath: model ?? modelPath },
        });
    };

    const handleView3D = () => {
        router.push({
            pathname: "/3d-view",
            params: { modelPath: model ?? modelPath },
        });
    };

    const player = useVideoPlayer(
        videoUrl === "" ? VIDEO_URL : videoUrl,
        (player) => {
            player.loop = true;
            player.muted = true;
            player.play();
        }
    );

    return (
        <View style={styles.container}>
            <VideoView
                style={{ width: "100%", height: "100%" }}
                player={player}
                nativeControls={false}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                contentFit="contain"
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                {isARSupported ? (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleViewInRoom}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons
                            name="view-in-ar"
                            size={14}
                            color="#ffffff"
                        />
                        <Text style={styles.buttonText}>View in your Room</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, { opacity: 0.5 }]}
                        onPress={handleViewInRoom}
                        activeOpacity={0.8}
                        disabled
                    >
                        <AntDesign
                            name="closecircleo"
                            size={14}
                            color="white"
                        />
                        <Text style={styles.buttonText}>AR Not Supported</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleView3D}
                    activeOpacity={0.8}
                >
                    <MaterialIcons
                        name="3d-rotation"
                        size={14}
                        color="#ffffff"
                    />
                    <Text style={styles.buttonText}>View 3D</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 80,
    },
    actionButton: {
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    buttonText: {
        backgroundColor: "transparent",
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "500",
        textAlign: "center",
    },
});
