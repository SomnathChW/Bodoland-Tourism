// import React, { useState, useRef, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     TouchableOpacity,
//     StatusBar,
//     Dimensions,
//     Text,
//     ActivityIndicator,
// } from "react-native";
// import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { FontAwesome6, Ionicons } from "@expo/vector-icons";
// import { ViroVRSceneNavigator } from "@reactvision/react-viro";

// import VRPhotoScene from "@/components/UI/VRScenes/VRPhotoScene";

// const VRViewFullScreen = () => {
//     const router = useRouter();
//     const params = useLocalSearchParams();
//     const insets = useSafeAreaInsets();

//     // Get tour_resource from route parameters
//     const tour_resource = params?.tour_resource as string;

//     const [isLoading, setIsLoading] = useState(true);
//     const [hasError, setHasError] = useState(false);
//     const [sceneKey, setSceneKey] = useState(0); // Add scene key for forcing re-render
//     const sceneNavigatorRef = useRef<any>(null);

//     // Check if tour_resource is provided
//     useEffect(() => {
//         if (!tour_resource) {
//             setIsLoading(false);
//             setHasError(true);
//         }
//     }, [tour_resource]);

//     // Handle screen focus - reload scene when returning from cardboard mode
//     useFocusEffect(
//         React.useCallback(() => {
//             if (tour_resource) {
//                 // Force scene reload by updating the key
//                 setSceneKey((prev) => prev + 1);
//                 setIsLoading(true);
//                 setHasError(false);
//             }
//         }, [tour_resource])
//     );

//     const handleBack = () => {
//         router.back();
//     };

//     const handleCardboardMode = () => {
//         router.push({
//             pathname: "/vr_view_cardboard",
//             params: { tour_resource },
//         });
//     };

//     const handleLoadStart = () => {
//         setIsLoading(true);
//         setHasError(false);
//     };

//     const handleLoadEnd = (event: any) => {
//         setIsLoading(false);
//     };

//     const handleError = (event: any) => {
//         setIsLoading(false);
//         setHasError(true);
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar hidden />

//             {/* VR Scene Navigator */}
//             <ViroVRSceneNavigator
//                 key={sceneKey} // Force re-render with scene key
//                 ref={sceneNavigatorRef}
//                 initialScene={{
//                     scene: () => (
//                         <VRPhotoScene
//                             handleLoadStart={handleLoadStart}
//                             handleLoadEnd={handleLoadEnd}
//                             handleError={handleError}
//                             tour_resource={tour_resource}
//                         />
//                     ),
//                 }}
//                 style={styles.vrContainer}
//                 vrModeEnabled={false}
//                 hdrEnabled={true}
//                 shadowsEnabled={true}
//                 viroAppProps={{
//                     tour_resource: tour_resource,
//                 }}
//             />

//             {/* Floating Action Buttons */}
//             <View
//                 style={[
//                     styles.floatingButtonsContainer,
//                     { top: insets.top + 10 },
//                 ]}
//             >
//                 {/* Back Button */}
//                 <TouchableOpacity
//                     style={styles.floatingBackButton}
//                     onPress={handleBack}
//                     activeOpacity={0.8}
//                 >
//                     <Ionicons name="arrow-back" size={24} color="#fff" />
//                 </TouchableOpacity>

//                 {/* Cardboard Mode Button */}
//                 {/* DISABLED FOR NOW */}
//                 {/* <TouchableOpacity
//                     style={[styles.cardboardButton]}
//                     onPress={handleCardboardMode}
//                     activeOpacity={0.8}
//                 >
//                     <FontAwesome6 name="vr-cardboard" size={20} color="#fff" />
//                 </TouchableOpacity> */}
//             </View>

//             {/* Loading Overlay */}
//             {isLoading && (
//                 <View style={styles.loadingOverlay}>
//                     <ActivityIndicator size="large" />
//                     <Text style={styles.loadingText}>
//                         Loading VR Experience...
//                     </Text>
//                 </View>
//             )}

//             {/* Error Overlay */}
//             {hasError && (
//                 <View style={styles.errorOverlay}>
//                     <View style={styles.errorContainer}>
//                         <Ionicons name="alert-circle-outline" size={48} />
//                         <Text style={styles.errorTitle}>
//                             VR Experience Unavailable
//                         </Text>
//                         <TouchableOpacity
//                             style={styles.retryButton}
//                             onPress={() => {
//                                 setHasError(false);
//                                 setIsLoading(true);
//                                 // Force re-render the scene
//                                 if (sceneNavigatorRef.current) {
//                                     sceneNavigatorRef.current.replace({
//                                         scene: () => (
//                                             <VRPhotoScene
//                                                 handleLoadStart={
//                                                     handleLoadStart
//                                                 }
//                                                 handleLoadEnd={handleLoadEnd}
//                                                 handleError={handleError}
//                                                 tour_resource={tour_resource}
//                                             />
//                                         ),
//                                     });
//                                 }
//                             }}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={styles.retryButtonText}>
//                                 Try Again
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={styles.closeButton}
//                             onPress={handleBack}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={styles.closeButtonText}>Close</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default VRViewFullScreen;

// const { width, height } = Dimensions.get("window");

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "black",
//     },
//     vrContainer: {
//         flex: 1,
//     },
//     floatingButtonsContainer: {
//         position: "absolute",
//         left: 20,
//         flexDirection: "row",
//         gap: 12,
//         zIndex: 10,
//     },
//     floatingBackButton: {
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         backgroundColor: "rgba(0, 0, 0, 0.3)",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     cardboardButton: {
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         backgroundColor: "rgba(0,0,0, 0.3)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     loadingOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0, 0, 0, 0.8)",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 20,
//     },
//     loadingText: {
//         color: "white",
//         fontSize: 16,
//         fontFamily: "SfProMedium",
//         marginTop: 16,
//         textAlign: "center",
//     },
//     errorOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0, 0, 0, 0.9)",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 20,
//         padding: 20,
//     },
//     errorContainer: {
//         backgroundColor: "rgba(52, 52, 52, 0.8)",
//         borderRadius: 16,
//         padding: 24,
//         alignItems: "center",
//         maxWidth: width * 0.8,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 4,
//         },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 8,
//     },
//     errorTitle: {
//         color: "white",
//         fontSize: 20,
//         fontFamily: "SfProMedium",
//         fontWeight: "600",
//         marginTop: 16,
//         marginBottom: 8,
//         textAlign: "center",
//     },
//     errorMessage: {
//         color: "rgba(255, 255, 255, 0.8)",
//         fontSize: 14,
//         textAlign: "center",
//         lineHeight: 20,
//         marginBottom: 24,
//     },
//     retryButton: {
//         backgroundColor: "rgba(46, 204, 113, 0.8)",
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//         borderRadius: 8,
//         marginBottom: 12,
//         minWidth: 120,
//     },
//     retryButtonText: {
//         color: "white",
//         fontSize: 16,
//         fontFamily: "SfProMedium",
//         fontWeight: "600",
//         textAlign: "center",
//     },
//     closeButton: {
//         backgroundColor: "transparent",
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: "rgba(255, 255, 255, 0.3)",
//         minWidth: 120,
//     },
//     closeButtonText: {
//         color: "rgba(255, 255, 255, 0.8)",
//         fontSize: 16,
//         fontFamily: "SfProMedium",
//         textAlign: "center",
//     },
// });
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Linking } from "react-native";

const VRViewFullScreen = () => {
    const params = useLocalSearchParams();
    // Get tour_resource from route parameters
    const tour_resource = params?.tour_resource as string;

    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleCardboardMode = () => {
        Linking.openURL(
            `https://coolidance.appwrite.network/?img=${tour_resource}`
        );
    };

    const [loading, setLoading] = React.useState(true);

    return (
        <>
            <WebView
                source={
                    loading
                        ? {
                              html: `<html><body style="background:black;display:flex;justify-content:center;align-items:center;height:100vh;"><h1 style="color:white;font-size:18px;">Loading VR Experience...</h1></body></html>`,
                          }
                        : {
                              uri: `https://coolidance.appwrite.network/?img=${tour_resource}`,
                          }
                }
                style={styles.webView}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                incognito={true}
                onLoadEnd={() => {
                    setLoading(false);
                }}
                onError={() => {
                    setLoading(false);
                }}
            />
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

                {/* Cardboard Mode Button */}
                <TouchableOpacity
                    style={[styles.cardboardButton]}
                    onPress={handleCardboardMode}
                    activeOpacity={0.8}
                >
                    <FontAwesome6 name="vr-cardboard" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default VRViewFullScreen;

const styles = StyleSheet.create({
    webView: {
        flex: 1,
        backgroundColor: "black",
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
    cardboardButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
});
