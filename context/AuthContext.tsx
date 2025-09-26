import {
    useContext,
    createContext,
    useState,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Models } from "react-native-appwrite";
import { toast } from "sonner-native";

import { account, ID, tablesdb, OAuthProvider } from "@/lib/appwrite";
import { useDataStore } from "@/store/useDataStore";

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

// Compare two semantic version strings. Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
function compareSemver(v1: string, v2: string): number {
    const a = v1.split(".").map(Number);
    const b = v2.split(".").map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const n1 = a[i] || 0;
        const n2 = b[i] || 0;
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
    }
    return 0;
}

const AuthContext = createContext<{
    user: Models.User<{}> | null;
    session: Models.Session | null;
    loading: boolean;
    isAppVersionGreaterThanRequired: boolean;
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
    isAppVersionGreaterThanRequired: true,
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
    const [
        isAppVersionGreaterThanRequired,
        setIsAppVersionGreaterThanRequired,
    ] = useState<boolean>(true);
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
        await SecureStore.deleteItemAsync(
            "lastCheckIsAppVersionGreaterThanRequired"
        );
    };

    const checkAppVersion = async (retryCount = 0) => {
        const maxRetries = 3;
        const retryDelay = 2000; // 2 seconds
        const requestTimeout = 10000; // 10 seconds timeout for each request
        const cacheKey = "lastCheckIsAppVersionGreaterThanRequired";
        const cacheExpiryMs = 24 * 60 * 60 * 1000; // 24 hours

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(
                    () => reject(new Error("Request timeout")),
                    requestTimeout
                )
            );

            // Race between the database request and timeout
            const appwriteVersionDoc = await Promise.race([
                tablesdb.getRow({
                    databaseId:
                        (process.env
                            .EXPO_PUBLIC_DATABASE_APP_CHECK as string) || "",
                    tableId: "version",
                    rowId: "version_id",
                }),
                timeoutPromise,
            ]);

            const appwriteVersion = (appwriteVersionDoc as any).key;

            // Cache the successful version check
            const appVer =
                typeof nativeApplicationVersion === "string"
                    ? nativeApplicationVersion
                    : "0.0.0";
            const dbVer =
                typeof appwriteVersion === "string" ? appwriteVersion : "0.0.0";
            const isAppVersionGreaterThanRequired =
                compareSemver(appVer, dbVer) > 0;
            const cacheData = {
                timestamp: Date.now(),
                serverVersion: appwriteVersion,
                appVersion: nativeApplicationVersion,
                isAppVersionGreaterThanRequired:
                    isAppVersionGreaterThanRequired,
            };
            await SecureStore.setItemAsync(cacheKey, JSON.stringify(cacheData));

            if (isAppVersionGreaterThanRequired) {
                setIsAppVersionGreaterThanRequired(true);
                return true;
            }
            setIsAppVersionGreaterThanRequired(false);
            return false;
        } catch (error) {
            console.error(
                `Error checking app version (attempt ${retryCount + 1}):`,
                error
            );

            // If network error and we haven't exceeded max retries, try again
            if (retryCount < maxRetries) {
                console.log(
                    `Retrying version check in ${retryDelay}ms... (${
                        retryCount + 1
                    }/${maxRetries})`
                );
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
                return checkAppVersion(retryCount + 1);
            }

            // If all retries failed, check cache
            try {
                const cachedDataStr = await SecureStore.getItemAsync(cacheKey);
                if (cachedDataStr) {
                    const cachedData = JSON.parse(cachedDataStr);
                    const isExpired =
                        Date.now() - cachedData.timestamp > cacheExpiryMs;

                    if (
                        !isExpired &&
                        cachedData.appVersion === nativeApplicationVersion
                    ) {
                        console.log(
                            "Using cached version check result due to network issues."
                        );
                        setIsAppVersionGreaterThanRequired(
                            cachedData.isAppVersionGreaterThanRequired
                        );
                        return cachedData.isAppVersionGreaterThanRequired;
                    }
                }
            } catch (cacheError) {
                console.error("Error reading version cache:", cacheError);
            }

            // If all retries failed and no valid cache, assume app is current version (network issue)
            // This prevents showing update screen due to network problems
            console.log(
                "Version check failed after all retries and no valid cache. Assuming current version due to network issues."
            );
            setIsAppVersionGreaterThanRequired(true);
            return true;
        }
    };

    const checkUserFromBackend = async () => {
        try {
            let responseSession = await account.getSession({
                sessionId: "current",
            });

            // Refresh OAuth tokens on every visit to ensure fresh tokens
            if (
                responseSession.provider &&
                responseSession.provider !== "email"
            ) {
                try {
                    responseSession = await account.updateSession({
                        sessionId: "current",
                    });
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
            if (
                error instanceof Error &&
                "type" in error &&
                (error as any).type.includes("general_unauthorized_scope")
            ) {
                // TODO: Check if user was previously logged in and show message accordingly
                // toast.info("Please SignIn to continue");
                await clearLocalData();
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

        // Step 2: check app version (with improved error handling)
        try {
            const currentVersion = await checkAppVersion();
            if (!currentVersion) {
                toast.error("Please update the app to the latest version");
                setLoading(false);
                setisAppReady(true);
                return;
            }
        } catch (error) {
            console.error("Unexpected error during version check:", error);
            // Don't block the app if version check fails unexpectedly
            toast.warning(
                "Unable to verify app version due to network issues. Continuing..."
            );
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
            const responseSession = await account.createEmailPasswordSession({
                email: email,
                password: password,
            });

            const responseUser = await account.get();
            setUser(responseUser);
            setSession(responseSession);

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
            await account.create({
                userId: ID.unique(),
                email: email,
                password: password,
                name: name,
            });
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
            const loginUrl = await account.createOAuth2Token({
                provider: OAuthProvider.Google,
                success: `${deepLink}`,
                failure: `${deepLink}`,
            });

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
                    const responseSession = await account.createSession({
                        userId: userId,
                        secret: secret,
                    });
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
            await account.deleteSession({ sessionId: "current" });
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
        isAppVersionGreaterThanRequired,
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
