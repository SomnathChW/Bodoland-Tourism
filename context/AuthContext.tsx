import {
    useContext,
    createContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { StyleSheet } from "react-native";
import * as SystemUI from "expo-system-ui";
import { Models } from "react-native-appwrite";
import { toast } from "sonner-native";

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
            console.log("responseSession", responseSession);
            setSession(responseSession);
            console.log("responseSession", responseSession);
            const responseUser = await account.get();
            setUser(responseUser);
        } catch (error) {
            if (
                error instanceof Error &&
                "type" in error &&
                (error as any).type.includes("general_unauthorized_scope")
            ) {
            } else {
                console.error("Error checking auth:", error);
            }
        }
        setLoading(false);
    };

    const signIn = async ({
        email,
        password,
        isSignup,
    }: {
        email: string;
        password: string;
        isSignup?: boolean;
    }) => {
        let toast_id: string | number = "";
        const loadingMessage = "Signing in...";
        const successMessage = "Signed in";
        const errorMessage = "Error signing in";

        if (!isSignup) {
            toast_id = toast.loading(loadingMessage);
        }
        setLoading(true);

        try {
            const responseSession = await account.createEmailPasswordSession(
                email,
                password
            );
            setSession(responseSession);
            const responseUser = await account.get();
            setUser(responseUser);

            if (!isSignup) {
                toast.success(successMessage, { id: toast_id });
            }
        } catch (error) {
            if (!isSignup) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: toast_id });
                } else {
                    toast.error(errorMessage, { id: toast_id });
                }
            }
        } finally {
            setLoading(false);
        }
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
        const toast_id = toast.loading("Signing up...");
        setLoading(true);
        try {
            await account.create(ID.unique(), email, password, name);
            toast.success("Signed up", { id: toast_id });
            await signIn({ email, password, isSignup: true });
        } catch (error) {
            console.error("Error signing up:", error);
        }
        setLoading(false);
    };

    const signOut = async () => {
        const toast_id = toast.loading("Signing out...");
        setLoading(true);
        try {
            await account.deleteSession("current");
            setSession(null);
            setUser(null);
            toast.success("Signed out", { id: toast_id });
        } catch (error) {
            console.error("Error signing out:", error);
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
            {loading
                ? // <View style={styles.container}>
                  //     <Text style={styles.text}>Loading..</Text>
                  // </View>
                  children
                : children}
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
