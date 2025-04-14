import React, { createContext, useContext, useState, ReactNode } from "react";

interface DrawerContextType {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerProviderProps {
    children: ReactNode;
}

export function DrawerProvider({ children }: DrawerProviderProps): JSX.Element {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    const toggleDrawer = (): void => {
        setIsDrawerOpen((prev) => !prev);
    };

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, toggleDrawer }}>
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
