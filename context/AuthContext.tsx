import { useContext, createContext, useState, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as SystemUI from "expo-system-ui";

const AuthContext = createContext({
    user: false,
    session: false,
    loading: true,
    signIn: async () => {},
    signOut: async () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(false);
    const [session, setSession] = useState(false);
    const [loading, setLoading] = useState(false);

    SystemUI.setBackgroundColorAsync("#0d1116");

    const signIn = async () => {
        setSession(true);
    };
    const signOut = async () => {
        setSession(false);
    };

    const contextData = {
        user,
        session,
        loading,
        signIn,
        signOut,
    };
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (
                <View style={styles.container}>
                    <Text style={styles.text}>Loading..</Text>
                </View>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthProvider, AuthContext };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        color: "white",
    },
});
