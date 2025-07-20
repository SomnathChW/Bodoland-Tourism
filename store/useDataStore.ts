import { create } from "zustand";

export type State = {
    attractions: any[];
    districts: any[];
    cuisines: any[];
    festivals: any[];
    hotels: any[];
    virtual_tours: any[];
    emergency_contacts: any[];
    souvenirs: any[];
    extras: any[];
};

export type Actions = {
    setData: (data: Partial<State>) => void;
    addToData: (key: keyof State, item: any) => void;
    appendToData: (key: keyof State, items: any[]) => void;
};

export const useDataStore = create<State & Actions>((set) => ({
    attractions: [],
    districts: [],
    cuisines: [],
    festivals: [],
    hotels: [],
    virtual_tours: [],
    emergency_contacts: [],
    souvenirs: [],
    extras: [],

    setData: (data) => set((state) => ({ ...state, ...data })),

    addToData: (key, item) =>
        set((state) => {
            // Handle if an array is accidentally passed to addToData
            if (Array.isArray(item)) {
                if (item.length === 1) {
                    item = item[0];
                } else {
                    return state;
                }
            }

            // Check if the item has an identifier
            if (!item.identifier) {
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
                items = [items];
            }

            // Filter out items that already exist in the state based on identifier
            const uniqueItems = items.filter((item) => {
                // Skip duplicate check if item has no identifier
                if (!item.identifier) {
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
