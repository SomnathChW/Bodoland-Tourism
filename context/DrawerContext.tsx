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
import { BackHandler } from "react-native";

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
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (isDrawerOpen) {
                    setIsDrawerOpen(false);
                    return true;
                }
                return false;
            }
        );
        return () => backHandler.remove();
    }, [isDrawerOpen]);

    useEffect(() => {
        setCurrentPath("/(protected)" + pathname);
    }, [pathname]);

    const toggleDrawer = useCallback((): void => {
        setIsDrawerOpen((prev) => !prev);
    }, []);

    const setPath = useCallback((path: string): void => {
        setCurrentPath(path);
    }, []);

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

export const DrawerProvider = React.memo(_DrawerProvider);

export const useDrawer = (): DrawerContextType => {
    const context = useContext(DrawerContext);
    if (context === undefined) {
        throw new Error("useDrawer must be used within a DrawerProvider");
    }
    return context;
};
