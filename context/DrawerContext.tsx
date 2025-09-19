import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useMemo,
    useCallback,
    JSX,
    useRef,
} from "react";
import { BackHandler } from "react-native";
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
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState<string>(
        "/(protected)" + pathname
    );
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastPathRef = useRef<string>("/(protected)");

    // Optimized pathname update using requestAnimationFrame for smooth navigation
    useEffect(() => {
        const formattedPath = "/(protected)" + pathname;

        if (lastPathRef.current !== formattedPath) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            // Use requestAnimationFrame for smooth updates
            debounceRef.current = setTimeout(() => {
                requestAnimationFrame(() => {
                    setCurrentPath(formattedPath);
                    lastPathRef.current = formattedPath;
                });
            }, 50); // Reduced to 50ms for more responsive feel
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [pathname]);

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

    const toggleDrawer = useCallback((): void => {
        setIsDrawerOpen((prev) => !prev);
    }, []);

    const setPath = useCallback((path: string): void => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        setCurrentPath(path);
        lastPathRef.current = path;
    }, []);

    // Memoize drawer-related values separately from path to reduce re-renders
    const drawerValue = useMemo(
        () => ({
            isDrawerOpen,
            toggleDrawer,
        }),
        [isDrawerOpen, toggleDrawer]
    );

    // Memoize path-related values separately
    const pathValue = useMemo(
        () => ({
            currentPath,
            setPath,
        }),
        [currentPath, setPath]
    );

    // Combine values but avoid unnecessary re-renders by keeping them stable
    const contextValue = useMemo(
        () => ({
            ...drawerValue,
            ...pathValue,
        }),
        [drawerValue, pathValue]
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
