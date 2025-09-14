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
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Models } from "react-native-appwrite";
import { toast } from "sonner-native";

import { account, ID, database, OAuthProvider } from "@/lib/appwrite";
import { useDataStore } from "@/store/useDataStore";

import { mockAccount } from "@/dev_helpers/mockAccount";
import { Platform } from "react-native";
import * as Application from "expo-application";
import * as Network from "expo-network";

const { nativeApplicationVersion } = Application;

const checkInternetConnection = async () => {
    try {
        const networkState = await Network.getNetworkStateAsync();
        return (
            networkState.isConnected === true &&
            networkState.isInternetReachable === true
        );
    } catch (error) {
        console.error("Error checking internet connection:", error);
        return false;
    }
};

const AuthContext = createContext<{
    user: Models.User<{}> | null;
    session: Models.Session | null;
    loading: boolean;
    isAppCurrentVersion: boolean;
    isInternetConnected: boolean;
    isAppReady: boolean;
    signIn: ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
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
    clearLocalData: () => Promise<void>;
}>({
    user: null,
    session: null,
    loading: true,
    isAppCurrentVersion: true,
    isInternetConnected: true,
    isAppReady: false,
    signIn: async () => {},
    signInWithGoogle: async () => {},
    signOut: async () => {},
    signUp: async () => {},
    clearLocalData: async () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
        null
    );
    const [session, setSession] = useState<Models.Session | null>(null);
    const [isAppCurrentVersion, setIsAppCurrentVersion] =
        useState<boolean>(true);
    const [isInternetConnected, setIsInternetConnected] =
        useState<boolean>(true);
    const [isAppReady, setisAppReady] = useState<boolean>(false);
    const hasInitialized = useRef(false);
    const { clearCart } = useDataStore();

    const clearLocalData = async () => {
        setSession(null);
        setUser(null);
        clearCart();
        await SecureStore.deleteItemAsync("cart");
    };

    const checkAppVersion = async () => {
        try {
            const appwriteVersionDoc = await database.getDocument(
                process.env.EXPO_PUBLIC_DATABASE_APP_CHECK || "",
                "version",
                "version_id"
            );
            const appwriteVersion = appwriteVersionDoc.key;

            if (appwriteVersion === nativeApplicationVersion) {
                setIsAppCurrentVersion(true);
                return true;
            }

            setIsAppCurrentVersion(false);
            return false;
        } catch (error) {
            // If we can’t reach backend, just return false
            console.error("Error checking app version:", error);
            setIsAppCurrentVersion(false);
            return false;
        }
    };

    const checkUserFromBackend = async () => {
        try {
            let responseSession = await account.getSession("current");

            // Refresh OAuth tokens on every visit to ensure fresh tokens
            if (
                responseSession.provider &&
                responseSession.provider !== "email"
            ) {
                try {
                    responseSession = await account.updateSession("current");
                } catch (refreshError) {
                    console.error(
                        "Failed to refresh OAuth token:",
                        refreshError
                    );
                    await signOut();
                    toast.error("Session expired. Please sign in again.");
                    return;
                }
            }

            const responseUser = await account.get();
            // const responseUser = await mockAccount.get();
            setLoading(false);
            setSession(responseSession);
            setUser(responseUser);

            // console.log(
            //     "User is authenticated:",
            //     JSON.stringify(responseUser, null, 2)
            // );
            // console.log(
            //     "Session details:",
            //     JSON.stringify(responseSession, null, 2)
            // );
        } catch (error) {
            await clearLocalData();
            if (
                error instanceof Error &&
                "type" in error &&
                (error as any).type.includes("general_unauthorized_scope")
            ) {
                // TODO: Check if user was previously logged in and show message accordingly
                // toast.info("Please SignIn to continue");
            } else {
                toast.error(
                    "Unable to verify session. Please try again later."
                );
            }
            // Only set loading to false if we haven't already done so in the try block
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Platform.OS === "android") {
            SystemUI.setBackgroundColorAsync("#0d1116");
        }

        if (!hasInitialized.current) {
            init();
            hasInitialized.current = true;
        }
    }, []);

    const init = async () => {
        // Step 1: check internet
        const internetConnected = await checkInternetConnection();
        setIsInternetConnected(internetConnected);

        if (!internetConnected) {
            toast.error("No internet connection");
            setLoading(false);
            setisAppReady(true);
            return;
        }
        // Step 2: check app version
        const currentVersion = await checkAppVersion();
        if (!currentVersion) {
            toast.error("Please update the app to the latest version");
            setLoading(false);
            setisAppReady(true);
            return;
        }
        // Step 3: if internet + version ok → verify user
        await checkUserFromBackend();
        setisAppReady(true);
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
            const responseUser = await account.get();
            // const responseUser = await mockAccount.get();
            setUser(responseUser);
            setSession(responseSession); // setting session here so that the user is already stored

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
            if (!isAppReady) {
                setisAppReady(true);
            }
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
        } catch (error) {
            toast.error("Error signing up", { id: toast_id });
        }

        try {
            await signIn({ email, password, isSignup: true });
        } catch {
            toast.error("Please Sign in Now", { id: toast_id });
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        const toast_id = toast.loading("Signing in with Google...");
        setLoading(true);

        try {
            // Create the redirect URI
            const deepLink = new URL(
                makeRedirectUri({ preferLocalhost: true })
            );
            const scheme = `${deepLink.protocol}//`;

            // Start OAuth flow - get the login URL
            const loginUrl = await account.createOAuth2Token(
                OAuthProvider.Google,
                `${deepLink}`,
                `${deepLink}`
            );

            // Open loginUrl and listen for the scheme redirect
            const result = await WebBrowser.openAuthSessionAsync(
                `${loginUrl}`,
                scheme
            );

            if (result.type === "success") {
                // Extract credentials from OAuth redirect URL
                const url = new URL(result.url);
                const secret = url.searchParams.get("secret");
                const userId = url.searchParams.get("userId");

                if (secret && userId) {
                    // Create session with OAuth credentials
                    const responseSession = await account.createSession(
                        userId,
                        secret
                    );
                    const responseUser = await account.get();

                    // Set user and session BEFORE setting loading to false
                    setUser(responseUser);
                    setSession(responseSession);
                    setLoading(false);

                    toast.success("Signed in with Google", { id: toast_id });
                } else {
                    throw new Error("Failed to get OAuth credentials");
                }
            } else {
                throw new Error("OAuth login was cancelled or failed");
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            if (error instanceof Error) {
                toast.error(
                    "Failed to sign in with Google, Please Try Again or try a different account",
                    { id: toast_id }
                );
            } else {
                toast.error("Error signing in with Google", { id: toast_id });
            }
            setLoading(false);
        }
    };

    const signOut = async () => {
        const toast_id = toast.loading("Signing out...");
        setLoading(true);
        try {
            await account.deleteSession("current");
            // await mockAccount.deleteSession();
            await clearLocalData();

            toast.success("Signed out", { id: toast_id });
        } catch (error) {
            if (
                error instanceof Error &&
                "type" in error &&
                (error as any).type.includes("general_unauthorized_scope")
            ) {
                await clearLocalData();

                toast.success("Signed out", { id: toast_id });
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
        isAppCurrentVersion,
        isInternetConnected,
        isAppReady,
        signIn,
        signInWithGoogle,
        signOut,
        signUp,
        clearLocalData,
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
