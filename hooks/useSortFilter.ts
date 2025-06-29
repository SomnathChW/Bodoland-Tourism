import { useState, useMemo } from "react";

export interface SortOption {
    id: string;
    label: string;
    getValue: (item: any) => any;
    compare?: (a: any, b: any) => number;
}

export interface FilterOption {
    id: string;
    label: string;
    type: "select" | "range" | "checkbox";
    options?: { label: string; value: any }[];
    min?: number;
    max?: number;
    getValue: (item: any) => any;
}

export interface UseSortFilterProps {
    data: any[];
    sortOptions: SortOption[];
    filterOptions?: FilterOption[];
}

export const useSortFilter = ({
    data,
    sortOptions,
    filterOptions = [],
}: UseSortFilterProps) => {
    const [activeSortId, setActiveSortId] = useState<string>("default");

    // Initialize filters with default values
    const getInitialFilters = () => {
        const initialFilters: Record<string, any> = {};
        filterOptions.forEach((filter) => {
            // Set default value to 'all' for all filters
            initialFilters[filter.id] = "all";
        });
        return initialFilters;
    };

    const [activeFilters, setActiveFilters] = useState<Record<string, any>>(
        getInitialFilters()
    );
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const sortedAndFilteredData = useMemo(() => {
        let result = [...data];

        // Apply filters
        for (const [filterId, filterValue] of Object.entries(activeFilters)) {
            if (
                filterValue === undefined ||
                filterValue === null ||
                filterValue === "all"
            )
                continue;

            const filterOption = filterOptions.find((f) => f.id === filterId);
            if (!filterOption) continue;

            result = result.filter((item) => {
                const itemValue = filterOption.getValue(item);

                switch (filterOption.type) {
                    case "select":
                        // Special handling for price range filters
                        if (filterId === "priceRange") {
                            if (filterValue === "free") {
                                const price = Number(
                                    typeof item["price"] === "string"
                                        ? item["price"]?.replace(/,/g, "")
                                        : item["price"] || 0
                                );
                                return price === 0;
                            }

                            // Extract max value from filter value (e.g., 'under1000' -> 1000)
                            const match = filterValue.match(/under(\d+)/);
                            if (match) {
                                const maxPrice = Number(match[1]);
                                const itemPrice = Number(
                                    typeof item["price"] === "string"
                                        ? item["price"].replace(/,/g, "")
                                        : item["price"] || 0
                                );
                                return itemPrice <= maxPrice; // Include free items (₹0) in "under" ranges
                            }
                        }

                        // Special handling for district filters
                        if (filterId === "district") {
                            const itemDistrict = (
                                item["district"] || ""
                            ).toLowerCase();
                            return (
                                filterValue === "all" ||
                                itemDistrict === filterValue
                            );
                        }

                        return itemValue === filterValue;
                    case "range":
                        return (
                            itemValue >= filterValue.min &&
                            itemValue <= filterValue.max
                        );
                    case "checkbox":
                        return Array.isArray(filterValue)
                            ? filterValue.length === 0 ||
                                  filterValue.includes(itemValue)
                            : filterValue === true
                            ? itemValue
                            : true;
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        if (activeSortId !== "default") {
            const sortOption = sortOptions.find((s) => s.id === activeSortId);
            if (sortOption) {
                result.sort((a, b) => {
                    if (sortOption.compare) {
                        return sortOption.compare(
                            sortOption.getValue(a),
                            sortOption.getValue(b)
                        );
                    }

                    const aValue = sortOption.getValue(a);
                    const bValue = sortOption.getValue(b);

                    // Handle different data types
                    if (
                        typeof aValue === "string" &&
                        typeof bValue === "string"
                    ) {
                        return aValue.localeCompare(bValue);
                    }

                    if (
                        typeof aValue === "number" &&
                        typeof bValue === "number"
                    ) {
                        return aValue - bValue;
                    }

                    // Fallback to string comparison
                    return String(aValue).localeCompare(String(bValue));
                });
            }
        }

        return result;
    }, [data, activeSortId, activeFilters, sortOptions, filterOptions]);

    const resetFilters = () => {
        setActiveFilters(getInitialFilters());
        setActiveSortId("default");
    };

    return {
        sortedAndFilteredData,
        activeSortId,
        setActiveSortId,
        activeFilters,
        setActiveFilters,
        sortModalVisible,
        setSortModalVisible,
        filterModalVisible,
        setFilterModalVisible,
        resetFilters,
    };
};
