import {
    useContext,
    createContext,
    useState,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import * as SystemUI from "expo-system-ui";
import * as SecureStore from "expo-secure-store";
import { Models } from "react-native-appwrite";
import { toast } from "sonner-native";

import { account, ID } from "@/lib/appwrite";

import { mockAccount } from "@/dev_helpers/mockAccount";

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
    const hasInitialized = useRef(false);

    const checkUserFromBackend = async () => {
        try {
            const responseSession = await account.getSession("current");
            // const responseSession = await mockAccount.getSession();
            setSession(responseSession);
            const responseUser = await account.get();
            // const responseUser = await mockAccount.get();
            setUser(responseUser);
        } catch (error) {
            if (
                error instanceof Error &&
                "type" in error &&
                (error as any).type.includes("general_unauthorized_scope")
            ) {
                const loggedIn = await SecureStore.getItemAsync("loggedIn");
                if (loggedIn) {
                    SecureStore.deleteItemAsync("loggedIn");
                    toast.error("Please sign in to continue");
                }
                await SecureStore.deleteItemAsync("session");
                await SecureStore.deleteItemAsync("user");
                setSession(null);
                setUser(null);
            } else {
                toast.error("Error checking your account");
            }
        }
    };

    useEffect(() => {
        SystemUI.setBackgroundColorAsync("#0d1116");
        if (!hasInitialized.current) {
            init();
            hasInitialized.current = true;
        }
    }, []);

    const init = async () => {
        await checkAuth();
    };

    const checkAuth = async () => {
        try {
            const sessionString = await SecureStore.getItemAsync("session");
            if (sessionString) {
                setSession(JSON.parse(sessionString));
            }
            const userString = await SecureStore.getItemAsync("user");
            if (userString) {
                setUser(JSON.parse(userString));
            }
            setLoading(false);
            checkUserFromBackend();
        } catch (error) {
            toast.error("Error checking your account");
        }
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
            // const responseSession =
            //     await mockAccount.createEmailPasswordSession(email, password);
            setSession(responseSession);
            const responseUser = await account.get();
            // const responseUser = await mockAccount.get();
            setUser(responseUser);

            await SecureStore.setItemAsync(
                "session",
                JSON.stringify(responseSession)
            );
            await SecureStore.setItemAsync(
                "user",
                JSON.stringify(responseUser)
            );
            await SecureStore.setItemAsync("loggedIn", true.toString());

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
            // await mockAccount.create(ID.unique(), email, password, name);
            toast.success("Signed up", { id: toast_id });
            await signIn({ email, password, isSignup: true });
        } catch (error) {
            toast.error("Error signing up");
        }
        setLoading(false);
    };

    const signOut = async () => {
        const toast_id = toast.loading("Signing out...");
        setLoading(true);
        try {
            await account.deleteSession("current");
            // await mockAccount.deleteSession();
            setSession(null);
            setUser(null);
            await SecureStore.deleteItemAsync("session");
            await SecureStore.deleteItemAsync("user");
            await SecureStore.deleteItemAsync("loggedIn");
            toast.success("Signed out", { id: toast_id });
        } catch (error) {
            if (
                error instanceof Error &&
                "type" in error &&
                (error as any).type.includes("general_unauthorized_scope")
            ) {
                await SecureStore.deleteItemAsync("session");
                await SecureStore.deleteItemAsync("user");
                await SecureStore.deleteItemAsync("loggedIn");
                setSession(null);
                setUser(null);
            } else {
                toast.error("Error signing out", { id: toast_id });
            }
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
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthProvider, AuthContext };
