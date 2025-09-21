// import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import React from "react";
// import { useState, useRef } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import {
//     ViroARSceneNavigator,
//     ViroARScene,
//     ViroAmbientLight,
//     ViroQuad,
//     ViroMaterials,
//     ViroARPlane,
//     Viro3DObject,
//     ViroText,
//     ViroNode,
// } from "@reactvision/react-viro";
// import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";
// import LottieView from "lottie-react-native";

// ViroMaterials.createMaterials({
//     QuadMaterial: {
//         lightingModel: "Constant",
//         diffuseColor: "",
//         blendMode: "Multiply",
//         diffuseIntensity: 0.8,
//     },
// });

// function ARScene({
//     modelPath,
//     onModelPlaced,
//     onModelLoadStart,
//     onModelLoadEnd,
//     onModelError,
// }: {
//     modelPath?: string;
//     onModelPlaced?: () => void;
//     onModelLoadStart?: () => void;
//     onModelLoadEnd?: () => void;
//     onModelError?: (error: string) => void;
// }) {
//     const [position, setPosition] = useState<Viro3DPoint | null>(null);
//     const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
//     const [modelError, setModelError] = useState<string | null>(null);

//     return (
//         <ViroARScene>
//             <ViroAmbientLight color="white" />
//             <ViroARPlane
//                 dragType="FixedToWorld"
//                 onAnchorFound={(anchor) => {
//                     setTimeout(() => {
//                         setPosition(anchor.position);
//                         // Call the handler to hide lottie when model is placed
//                         if (onModelPlaced) {
//                             onModelPlaced();
//                         }
//                     }, 1000);
//                 }}
//             >
//                 {position && (
//                     <ViroNode position={[0, 0.5, 0]}>
//                         {isModelLoading && (
//                             <ViroText
//                                 text="Loading 3D model..."
//                                 scale={[0.5, 0.5, 0.5]}
//                                 position={[0, 0, 0]}
//                                 style={{
//                                     fontSize: 20,
//                                     color: "white",
//                                     fontWeight: "bold",
//                                     textAlignVertical: "center",
//                                     textAlign: "center",
//                                 }}
//                             />
//                         )}
//                         {modelError && (
//                             <ViroText
//                                 text={`Error loading model: ${modelError}\nPlease go back and try again.`}
//                                 scale={[0.5, 0.5, 0.5]}
//                                 position={[0, 0, 0]}
//                                 style={{
//                                     fontSize: 20,
//                                     color: "red",
//                                     fontWeight: "bold",
//                                     textAlignVertical: "center",
//                                     textAlign: "center",
//                                 }}
//                             />
//                         )}
//                     </ViroNode>
//                 )}

//                 <Viro3DObject
//                     visible={!!position && !modelError}
//                     source={{ uri: modelPath }}
//                     position={[0, 0, 0]}
//                     scale={[0.3, 0.3, 0.3]}
//                     type="GLB"
//                     dragType="FixedToWorld"
//                     onDrag={() => {}}
//                     onLoadStart={() => {
//                         setIsModelLoading(true);
//                         if (onModelLoadStart) {
//                             onModelLoadStart();
//                         }
//                     }}
//                     onLoadEnd={() => {
//                         setIsModelLoading(false);
//                         if (onModelLoadEnd) {
//                             onModelLoadEnd();
//                         }
//                     }}
//                     onError={(event) => {
//                         const errorMsg = event.nativeEvent.error ? 
//                             String(event.nativeEvent.error) : "Unknown error";
//                         setIsModelLoading(false);
//                         setModelError(errorMsg);
//                         if (onModelError) {
//                             onModelError(errorMsg);
//                         }
//                     }}
//                 />
//                 <ViroQuad
//                     visible={!position}
//                     position={[0, 0, 0]}
//                     width={1}
//                     height={1}
//                     rotation={[-90, 0, 0]}
//                     materials="QuadMaterial"
//                 />
//             </ViroARPlane>
//         </ViroARScene>
//     );
// }

// const ARView = () => {
//     const router = useRouter();
//     const insets = useSafeAreaInsets();

//     const params = useLocalSearchParams();
//     const modelPath = params.modelPath;

//     const [shouldShowLottie, setShouldShowLottie] = useState(true);
//     const [isModelLoading, setIsModelLoading] = useState(false);
//     const [modelError, setModelError] = useState<string | null>(null);

//     const handleModelPlaced = () => {
//         setShouldShowLottie(false);
//     };

//     const handleModelLoadStart = () => {
//         setIsModelLoading(true);
//     };

//     const handleModelLoadEnd = () => {
//         setIsModelLoading(false);
//     };

//     const handleModelError = (error: string) => {
//         setModelError(error);
//         setIsModelLoading(false);
//     };

//     const fallbackModelPath =
//         "https://raw.githubusercontent.com/google/filament/main/third_party/models/DamagedHelmet/DamagedHelmet.glb";

//     return (
//         <View style={styles.container}>
//             <ViroARSceneNavigator
//                 style={styles.arNavigator}
//                 initialScene={{
//                     scene: () =>
//                         ARScene({
//                             modelPath:
//                                 (modelPath as string) || fallbackModelPath,
//                             onModelPlaced: handleModelPlaced,
//                             onModelLoadStart: handleModelLoadStart,
//                             onModelLoadEnd: handleModelLoadEnd,
//                             onModelError: handleModelError,
//                         }),
//                 }}
//             />
//             {/* Floating Back Button */}
//             <TouchableOpacity
//                 style={[styles.floatingBackButton, { top: insets.top + 10 }]}
//                 onPress={() => router.back()}
//                 activeOpacity={0.8}
//             >
//                 <Ionicons name="arrow-back" size={24} color="#fff" />
//             </TouchableOpacity>

//             {/* Instructions */}
//             {shouldShowLottie && (
//                 <View
//                     style={[
//                         styles.instructionsContainer,
//                         { top: insets.top + 60 },
//                     ]}
//                 >
//                     <Text style={styles.instructionText}>
//                         Point camera at a flat surface to detect plane
//                     </Text>
//                     <Text style={styles.instructionText}>
//                         The model will appear once a plane is detected
//                     </Text>
//                 </View>
//             )}

//             {/* Loading State Overlay */}
//             {isModelLoading && !shouldShowLottie && (
//                 <View style={styles.loadingOverlay}>
//                     <Text style={styles.loadingText}>Loading 3D model...</Text>
//                 </View>
//             )}

//             {/* Error State Overlay */}
//             {modelError && !shouldShowLottie && (
//                 <View style={styles.errorOverlay}>
//                     <Text style={styles.errorText}>
//                         Error loading model: {modelError}
//                     </Text>
//                     <TouchableOpacity
//                         style={styles.backButton}
//                         onPress={() => router.back()}
//                     >
//                         <Text style={styles.backButtonText}>Go Back</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}

//             {/* AR Scan Lottie Animation */}
//             {shouldShowLottie && (
//                 <LottieView
//                     source={require("@/assets/lottie/ar-view.json")}
//                     style={styles.lottieAnimation}
//                     autoPlay
//                     loop
//                 />
//             )}
//         </View>
//     );
// };

// export default ARView;

// const styles = StyleSheet.create({
//     container: {
//         width: "100%",
//         height: "100%",
//         flex: 1,
//         backgroundColor: "#000000",
//     },
//     arNavigator: {
//         width: "100%",
//         height: "100%",
//     },
//     text: {
//         color: "#ffffff",
//         fontSize: 24,
//     },
//     floatingBackButton: {
//         position: "absolute",
//         left: 20,
//         zIndex: 15,
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: "rgba(0, 0, 0, 0.3)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     instructionsContainer: {
//         position: "absolute",
//         left: 20,
//         right: 20,
//         zIndex: 10,
//         backgroundColor: "rgba(0, 0, 0, 0.3)",
//         padding: 12,
//         borderRadius: 8,
//     },
//     instructionText: {
//         color: "#ffffff",
//         fontSize: 14,
//         textAlign: "center",
//         marginVertical: 2,
//     },
//     helloWorldTextStyle: {
//         fontFamily: "Arial",
//         fontSize: 30,
//         color: "#ffffff",
//         textAlignVertical: "center",
//         textAlign: "center",
//     },
//     lottieAnimation: {
//         position: "absolute",
//         top: "50%",
//         left: "50%",
//         width: 300,
//         height: 300,
//         marginTop: -150,
//         marginLeft: -150,
//         backgroundColor: "transparent",
//         zIndex: 5,
//         pointerEvents: "none", // This allows touches to pass through
//     },
//     loadingOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 20,
//     },
//     loadingText: {
//         color: "#ffffff",
//         fontSize: 18,
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     errorOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0, 0, 0, 0.7)",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 20,
//         padding: 20,
//     },
//     errorText: {
//         color: "#ff5252",
//         fontSize: 18,
//         fontWeight: "bold",
//         textAlign: "center",
//         marginBottom: 20,
//     },
//     backButton: {
//         backgroundColor: "#1e88e5",
//         paddingVertical: 12,
//         paddingHorizontal: 24,
//         borderRadius: 8,
//         marginTop: 20,
//     },
//     backButtonText: {
//         color: "#ffffff",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
// });


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ARView = () => {
  return (
    <View>
      <Text>ARView</Text>
    </View>
  )
}

export default ARView

const styles = StyleSheet.create({})