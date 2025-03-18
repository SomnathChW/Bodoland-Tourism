import {
    useContext,
    createContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import * as SystemUI from "expo-system-ui";
import { Models } from "react-native-appwrite";

import { account, ID } from "@/lib/appwrite";

const AuthContext = createContext<{
    user: Models.User<{}> | null;
    session: Models.Session | null;
    loading: boolean;
    signIn: ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: ({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) => Promise<void>;
}>({
    user: null,
    session: null,
    loading: true,
    signIn: async () => {},
    signOut: async () => {},
    signUp: async () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
        null
    );
    const [session, setSession] = useState<Models.Session | null>(null);

    SystemUI.setBackgroundColorAsync("#0d1116");

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await checkAuth();
    };

    const checkAuth = async () => {
        try {
            const responseSession = await account.getSession("current");
            setSession(responseSession);
            const responseUser = await account.get();
            setUser(responseUser);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const signIn = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        setLoading(true);
        try {
            const responseSession = await account.createEmailPasswordSession(
                email,
                password
            );
            console.log(responseSession);
            setSession(responseSession);
            const responseUser = await account.get();
            console.log(responseUser);
            setUser(responseUser);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const signUp = async ({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) => {
        setLoading(true);
        try {
            await account.create(ID.unique(), email, password, name);
            await signIn({ email, password });
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await account.deleteSession("current");
            setSession(null);
            setUser(null);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const contextData = {
        user,
        session,
        loading,
        signIn,
        signOut,
        signUp,
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
