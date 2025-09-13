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

import { account, ID, OAuthProvider } from "@/lib/appwrite";
import { useDataStore } from "@/store/useDataStore";

import { mockAccount } from "@/dev_helpers/mockAccount";
import { Platform } from "react-native";

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
}>({
    user: null,
    session: null,
    loading: true,
    signIn: async () => {},
    signInWithGoogle: async () => {},
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
    const { clearCart } = useDataStore();

    const checkUserFromBackend = async () => {
        try {
            let responseSession = await account.getSession("current");
            // const responseSession = await mockAccount.getSession();
            let tokenWasRefreshed = false;

            // Refresh OAuth tokens on every visit to ensure fresh tokens
            if (
                responseSession.provider &&
                responseSession.provider !== "email"
            ) {
                try {
                    console.log("Refreshing OAuth token...");
                    responseSession = await account.updateSession("current");
                    tokenWasRefreshed = true;
                    console.log("OAuth token refreshed successfully");
                } catch (refreshError) {
                    console.error(
                        "Failed to refresh OAuth token:",
                        refreshError
                    );
                    // If refresh fails, continue with the existing session
                    // The user will need to re-authenticate if they encounter issues
                }
            }

            const responseUser = await account.get();
            // const responseUser = await mockAccount.get();
            setSession(responseSession);
            setUser(responseUser);

            // Check if secure store has session and user, if not, set them
            const sessionString = await SecureStore.getItemAsync("session");
            const userString = await SecureStore.getItemAsync("user");
            const loggedIn = await SecureStore.getItemAsync("loggedIn");

            if (!sessionString || !userString || !loggedIn) {
                // First time storing - store everything
                await SecureStore.setItemAsync(
                    "session",
                    JSON.stringify(responseSession)
                );
                await SecureStore.setItemAsync(
                    "user",
                    JSON.stringify(responseUser)
                );
                await SecureStore.setItemAsync("loggedIn", true.toString());
            } else if (tokenWasRefreshed) {
                // Only update stored session if token was actually refreshed
                await SecureStore.setItemAsync(
                    "session",
                    JSON.stringify(responseSession)
                );
                console.log("Updated stored session with refreshed token");
            }
            // If token wasn't refreshed and we have stored data, no need to update storage
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
        if (Platform.OS === "android") {
            SystemUI.setBackgroundColorAsync("#0d1116");
        }

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
            const userString = await SecureStore.getItemAsync("user");
            if (sessionString) {
                setSession(JSON.parse(sessionString));
            }
            if (userString) {
                setUser(JSON.parse(userString));
            }
            setLoading(false);
            checkUserFromBackend();
        } catch (error) {
            toast.error("Error checking your account");
            setLoading(false);
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
            const responseUser = await account.get();
            // const responseUser = await mockAccount.get();
            setUser(responseUser);
            await SecureStore.setItemAsync(
                "user",
                JSON.stringify(responseUser)
            );
            setSession(responseSession); // setting session here so that the user is already stored

            await SecureStore.setItemAsync(
                "session",
                JSON.stringify(responseSession)
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
        } catch (error) {
            toast.error("Error signing up", { id: toast_id });
        }

        try {
            await signIn({ email, password, isSignup: true });
        } catch {
            toast.error("Please Sign in Now", { id: toast_id });
        }
        setLoading(false);
    };

    const signInWithGoogle = async () => {
        const toast_id = toast.loading("Signing in with Google...");
        setLoading(true);

        try {
            // Create the redirect URI
            const deepLink = new URL(
                makeRedirectUri({ preferLocalhost: true })
            );
            const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'appwrite-callback-<PROJECT_ID>://'

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

                    setUser(responseUser);
                    setSession(responseSession);

                    // Store in secure storage - same as email login
                    await SecureStore.setItemAsync(
                        "user",
                        JSON.stringify(responseUser)
                    );
                    await SecureStore.setItemAsync(
                        "session",
                        JSON.stringify(responseSession)
                    );
                    await SecureStore.setItemAsync("loggedIn", true.toString());

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
                toast.error(error.message, { id: toast_id });
            } else {
                toast.error("Error signing in with Google", { id: toast_id });
            }
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        const toast_id = toast.loading("Signing out...");
        setLoading(true);
        try {
            await account.deleteSession("current");
            // await mockAccount.deleteSession();
            setSession(null);
            setUser(null);

            // Clear cart from Zustand store
            clearCart();

            // Clear all user data from SecureStore
            await SecureStore.deleteItemAsync("session");
            await SecureStore.deleteItemAsync("user");
            await SecureStore.deleteItemAsync("loggedIn");
            await SecureStore.deleteItemAsync("cart"); // Clear cart from SecureStore

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
                await SecureStore.deleteItemAsync("cart"); // Clear cart from SecureStore
                setSession(null);
                setUser(null);

                // Clear cart from Zustand store
                clearCart();
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
        signInWithGoogle,
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
