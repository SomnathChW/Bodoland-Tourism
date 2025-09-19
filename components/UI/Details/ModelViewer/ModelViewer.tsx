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
import { StyleSheet, View, Text } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { isARSupportedOnDevice } from "@reactvision/react-viro";
import FastImageWLoader from "@/components/FastImageWLoader";
import FastImage from "@d11/react-native-fast-image";
import { TouchableOpacity } from "react-native-gesture-handler";

const modelPath =
    "https://fra.cloud.appwrite.io/v1/storage/buckets/model_placeholders/files/khopari/view?project=bodoland-tourism";
const modelImagePath = "https://picsum.photos/300/300?random=1564";

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
    model_image_url: string;
    souvenirName?: string;
    souvenirPrice?: string;
    souvenirDimensions?: string;
    currency?: string;
}

const checkARSupport = async () => {
    // try {
    //     const result = await isARSupportedOnDevice();
    //     return result.isARSupported;
    // } catch (error) {
    //     return false;
    // }
    return false; // Temporarily disable AR check due to library issues
};

export function ModelViewer({
    scale,
    model,
    bgColor,
    model_image_url,
    souvenirName,
    souvenirPrice,
    souvenirDimensions,
    currency,
}: ModelViewerProps) {
    const backgroundColor = bgColor ?? "#222222";
    const [isARSupported, setIsARSupported] = React.useState<boolean | null>(
        null
    );
    const router = useRouter();

    const imageUrl = model_image_url === "" ? modelImagePath : model_image_url;

    useEffect(() => {
        const checkAR = async () => {
            const supported = await checkARSupport();
            setIsARSupported(supported);
        };
        checkAR();
    }, []);

    const handleViewInRoom = () => {
        router.push({
            pathname: "/ar_view",
            params: { modelPath: model ?? modelPath },
        });
    };

    const handleView3D = () => {
        router.push({
            pathname: "/3d_view",
            params: {
                modelPath: model ?? modelPath,
                souvenirName,
                souvenirPrice,
                souvenirDimensions,
                currency,
            },
        });
    };

    return (
        <View style={styles.container}>
            <FastImageWLoader
                source={{ uri: imageUrl }}
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor,
                }}
                resizeMode={FastImage.resizeMode.cover}
                indicatorSize={"large"}
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                {isARSupported === null ? (
                    // Loading state - show a consistent button while checking AR support
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {}} // No action while loading
                        activeOpacity={0.8}
                        disabled
                    >
                        <MaterialIcons
                            name="view-in-ar"
                            size={14}
                            color="#ffffff"
                        />
                        <Text style={styles.buttonText} numberOfLines={1}>
                            Checking AR...
                        </Text>
                    </TouchableOpacity>
                ) : isARSupported ? (
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
                        <Text style={styles.buttonText} numberOfLines={1}>
                            View in your Room
                        </Text>
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
                        <Text style={styles.buttonText} numberOfLines={1}>
                            AR Not Supported
                        </Text>
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
                    <Text style={styles.buttonText} numberOfLines={1}>
                        View 3D
                    </Text>
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
        gap: 12,
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
        minHeight: 44, // Ensure consistent height
    },
    buttonText: {
        backgroundColor: "transparent",
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "500",
        textAlign: "center",
    },
});
