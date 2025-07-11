type State = {
    attractions: any[];
    districts: any[];
    cuisine: any[];
    festivale: any[];
    hotels: any[];
    virtual_tours: any[];
    emergency_contacts: any[];
    souvenirs: any[];
};

type Actions = {
    setData: (data: Partial<State>) => void;
    addToData: (key: keyof State, item: any) => void;
    appendToData: (key: keyof State, items: any[]) => void;
};

import { create } from "zustand";

export const useDataStore = create<State & Actions>((set) => ({
    attractions: [],
    districts: [],
    cuisine: [],
    festivale: [],
    hotels: [],
    virtual_tours: [],
    emergency_contacts: [],
    souvenirs: [],

    setData: (data) => set((state) => ({ ...state, ...data })),

    addToData: (key, item) =>
        set((state) => {
            // Handle if an array is accidentally passed to addToData
            if (Array.isArray(item)) {
                console.warn(
                    "Array passed to addToData. Use appendToData for arrays."
                );
                // Extract item from array if it's a single-item array
                if (item.length === 1) {
                    item = item[0];
                } else {
                    // Return unchanged state if it's not a single-item array
                    return state;
                }
            }

            // Check if the item has an identifier
            if (!item.identifier) {
                console.warn(
                    "Item has no identifier property, duplicate check skipped."
                );
                return {
                    [key]: [...state[key], item],
                };
            }

            // Check if the item with the same identifier already exists
            const itemExists = state[key].some(
                (existingItem) => existingItem.identifier === item.identifier
            );

            // Only add the item if it doesn't already exist
            if (!itemExists) {
                return {
                    [key]: [...state[key], item],
                };
            }

            // Return the unchanged state if the item already exists
            return state;
        }),

    appendToData: (key, items) =>
        set((state) => {
            // Handle if a non-array is accidentally passed to appendToData
            if (!Array.isArray(items)) {
                console.warn(
                    "Non-array passed to appendToData. Use addToData for single items."
                );
                // Treat it as a single item array
                items = [items];
            }

            // Filter out items that already exist in the state based on identifier
            const uniqueItems = items.filter((item) => {
                // Skip duplicate check if item has no identifier
                if (!item.identifier) {
                    console.warn(
                        "Item has no identifier property, duplicate check skipped."
                    );
                    return true;
                }

                return !state[key].some(
                    (existingItem) =>
                        existingItem.identifier === item.identifier
                );
            });

            // Only append items that don't already exist
            if (uniqueItems.length > 0) {
                return {
                    [key]: [...state[key], ...uniqueItems],
                };
            }

            // Return the unchanged state if all items already exist
            return state;
        }),
}));
