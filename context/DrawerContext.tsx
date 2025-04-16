import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { usePathname } from "expo-router";

interface DrawerContextType {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
    setPath: (path: string) => void;
    currentPath: string;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerProviderProps {
    children: ReactNode;
}

export function _DrawerProvider({
    children,
}: DrawerProviderProps): JSX.Element {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [currentPath, setCurrentPath] = useState<string>("/(protected)");

    const pathname = usePathname();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentPath("/(protected)" + pathname);
        }, 200); // delay just enough to avoid blocking tab switch

        return () => clearTimeout(timeout);
    }, [pathname]);

    const toggleDrawer = useCallback((): void => {
        setIsDrawerOpen((prev) => !prev);
    }, []);

    const setPath = useCallback((path: string): void => {
        setCurrentPath(path);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            isDrawerOpen,
            toggleDrawer,
            setPath,
            currentPath,
        }),
        [isDrawerOpen, toggleDrawer, setPath, currentPath]
    );

    return (
        <DrawerContext.Provider value={contextValue}>
            {children}
        </DrawerContext.Provider>
    );
}

// Memoized version of the DrawerProvider
export const DrawerProvider = React.memo(_DrawerProvider);

export const useDrawer = (): DrawerContextType => {
    const context = useContext(DrawerContext);
    if (context === undefined) {
        throw new Error("useDrawer must be used within a DrawerProvider");
    }
    return context;
};
