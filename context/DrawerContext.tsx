import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
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

export function DrawerProvider({ children }: DrawerProviderProps): JSX.Element {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [currentPath, setCurrentPath] = useState<string>("/(protected)");

    const pathname = usePathname();

    useEffect(() => {
        setCurrentPath("/(protected)" + pathname); // auto-sync with current route
    }, [pathname]);

    const toggleDrawer = (): void => {
        setIsDrawerOpen((prev) => !prev);
    };

    const setPath = (path: string): void => {
        setCurrentPath(path);
    };

    return (
        <DrawerContext.Provider
            value={{ isDrawerOpen, toggleDrawer, setPath, currentPath }}
        >
            {children}
        </DrawerContext.Provider>
    );
}

export const useDrawer = (): DrawerContextType => {
    const context = useContext(DrawerContext);
    if (context === undefined) {
        throw new Error("useDrawer must be used within a DrawerProvider");
    }
    return context;
};
