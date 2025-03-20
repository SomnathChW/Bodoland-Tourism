import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { TextInput } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { validateAuthInputs } from "@/lib/formValidator";
import { toast } from "sonner-native";

const SignInPage = () => {
    const { session, signIn, signUp } = useAuth();
    const [secureText, setSecureText] = useState(true);
    const [showNameInput, setShowNameInput] = useState(false);

    const height = useSharedValue(0);
    const opacity = useSharedValue(0);
    const margin = useSharedValue(0);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    NavigationBar.setBackgroundColorAsync("#0d1116");

    const handleSignIn = () => {
        if (!validateAuthInputs({ email, password, name: "signin" })) {
            return;
        } else {
            signIn({ email, password });
        }
    };

    const handlesignUp = () => {
        if (!validateAuthInputs({ email, password, name })) {
            return;
        } else {
            signUp({ email, password, name });
        }
    };

    const handleSignUpShow = () => {
        if (showNameInput) {
            height.value = withTiming(0, { duration: 300 });
            opacity.value = withTiming(0, { duration: 200 });
            margin.value = withTiming(0, { duration: 200 });
        } else {
            height.value = withTiming(50, { duration: 300 });
            opacity.value = withTiming(1, { duration: 600 });
            margin.value = withTiming(20, { duration: 200 });
        }
        setShowNameInput(!showNameInput);
    };

    const nameInputStyle = useAnimatedStyle(() => ({
        height: height.value,
        marginBottom: margin.value,
        opacity: opacity.value,
    }));

    if (session) {
        return <Redirect href="/(protected)/(tabs)" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                {showNameInput ? "Welcome" : "Welcome Back"}
            </Text>
            <Text style={styles.subHeadding}>
                {showNameInput
                    ? "Lets get you onboarded"
                    : "Lets get you going again"}
            </Text>
            {/* Name Input (Hidden Initially) */}
            <Animated.View style={nameInputStyle}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Full Name"
                    placeholderTextColor={"#3a3e50"}
                    cursorColor={"white"}
                    onChangeText={(text) => setName(text)}
                />
            </Animated.View>
            {/* Email Input */}
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                inputMode="email"
                placeholderTextColor={"#3a3e50"}
                cursorColor={"white"}
                onChangeText={(text) => setEmail(text)}
            />
            {/* Password Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="#3a3e50"
                    cursorColor="white"
                    secureTextEntry={secureText}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                    onPress={() => setSecureText(!secureText)}
                    style={styles.icon}
                >
                    <MaterialCommunityIcons
                        name={secureText ? "eye" : "eye-off"}
                        size={24}
                        color="#3a3e50"
                    />
                </TouchableOpacity>
            </View>
            {/* Buttons */}
            <Animated.View style={[styles.buttonContainer]}>
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={showNameInput ? handlesignUp : handleSignIn}
                >
                    <Text style={styles.signInButtonText}>
                        {showNameInput ? "  Sign Up" : "  Sign In"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUpShow}>
                    <Text style={styles.subHeadding}>
                        {showNameInput
                            ? "Already a user?"
                            : "Don't have an account?"}
                        <Text style={styles.signUpText}>
                            {showNameInput ? "  Sign In" : "  Sign Up"}
                        </Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleSignIn}
                >
                    <AntDesign name="google" size={22} color="white" />
                    <Text style={styles.signInButtonText}>
                        Continue with Google
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default SignInPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
    },
    heading: {
        fontSize: 33,
        color: "white",
        marginBottom: 2,
        fontWeight: "bold",
    },
    subHeadding: {
        fontSize: 16,
        color: "#646f7e",
        marginBottom: 30,
    },
    signInButton: {
        backgroundColor: "#3a3e50",
        color: "white",
        borderRadius: 10,
        padding: 7,
        marginBottom: 20,
        width: "100%",
    },
    signInButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        padding: 10,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    textInput: {
        borderColor: "#3a3e50",
        borderWidth: 2,
        marginBottom: 20,
        height: 50,
        borderRadius: 10,
        padding: 10,
        color: "white",
        fontWeight: "bold",
    },
    passwordInput: {
        flex: 1,
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#3a3e50",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
    },
    icon: {
        padding: 5,
    },
    googleButton: {
        backgroundColor: "#3a3e50",
        color: "white",
        borderRadius: 10,
        padding: 7,
        marginBottom: 20,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    signUpText: {
        fontWeight: "bold",
        color: "white",
    },
});
