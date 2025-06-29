import { SortOption, FilterOption } from "@/hooks/useSortFilter";

// Common sort options that can be used across different pages
export const createAlphabeticalSortOptions = (
    nameKey: string = "name"
): SortOption[] => [
    {
        id: "alphabetical",
        label: "Alphabetical (A-Z)",
        getValue: (item) => item[nameKey],
    },
    {
        id: "alphabetical-desc",
        label: "Alphabetical (Z-A)",
        getValue: (item) => item[nameKey],
        compare: (a, b) => b.localeCompare(a),
    },
];

export const createPriceSortOptions = (
    priceKey: string = "price"
): SortOption[] => [
    {
        id: "price-low-high",
        label: "Price: Low to High",
        getValue: (item) => {
            const price = item[priceKey];
            // Handle different price formats (with commas, etc.)
            return Number(
                typeof price === "string" ? price.replace(/,/g, "") : price || 0
            );
        },
    },
    {
        id: "price-high-low",
        label: "Price: High to Low",
        getValue: (item) => {
            const price = item[priceKey];
            return Number(
                typeof price === "string" ? price.replace(/,/g, "") : price || 0
            );
        },
        compare: (a, b) => b - a,
    },
];

export const createRatingSortOptions = (
    ratingKey: string = "rating"
): SortOption[] => [
    {
        id: "rating-high-low",
        label: "Rating: High to Low",
        getValue: (item) => Number(item[ratingKey] || 0),
        compare: (a, b) => b - a,
    },
    {
        id: "rating-low-high",
        label: "Rating: Low to High",
        getValue: (item) => Number(item[ratingKey] || 0),
    },
];

// Common filter options
export const createPriceRangeFilter = (
    priceKey: string = "price",
    ranges: { label: string; value: string; max?: number }[] = [
        { label: "Under ₹500", value: "under500", max: 500 },
        { label: "Under ₹1000", value: "under1000", max: 1000 },
        { label: "Under ₹2000", value: "under2000", max: 2000 },
        { label: "Above ₹2000", value: "above2000" },
    ]
): FilterOption => ({
    id: "priceRange",
    label: "Price Range",
    type: "select",
    getValue: (item) => {
        // This is only used for categorization purposes in the original logic
        // The actual filtering is now handled in the useSortFilter hook
        const price = Number(
            typeof item[priceKey] === "string"
                ? item[priceKey].replace(/,/g, "")
                : item[priceKey] || 0
        );
        return price;
    },
    options: [
        { label: "All Prices", value: "all" },
        { label: "Free", value: "free" },
        ...ranges.map((r) => ({ label: r.label, value: r.value })),
    ],
});

export const createRatingFilter = (
    ratingKey: string = "rating"
): FilterOption => ({
    id: "rating",
    label: "Rating",
    type: "select",
    getValue: (item) => {
        const rating = Number(item[ratingKey] || 0);
        if (rating >= 4.5) return "4.5+";
        if (rating >= 4.0) return "4.0+";
        if (rating >= 3.5) return "3.5+";
        return "below3.5";
    },
    options: [
        { label: "All Ratings", value: "all" },
        { label: "4.5+ Stars", value: "4.5+" },
        { label: "4.0+ Stars", value: "4.0+" },
        { label: "3.5+ Stars", value: "3.5+" },
    ],
});

export const createDistrictFilter = (
    districtKey: string = "district"
): FilterOption => ({
    id: "district",
    label: "District",
    type: "select",
    getValue: (item) => {
        const district = item[districtKey] || "";
        return district.toLowerCase();
    },
    options: [
        { label: "All Districts", value: "all" },
        { label: "Kokrajhar", value: "kokrajhar" },
        { label: "Chirang", value: "chirang" },
        { label: "Baksa", value: "baksa" },
        { label: "Udalguri", value: "udalguri" },
        { label: "Tamulpur", value: "tamulpur" },
    ],
});

// Preset configurations for different content types
export const attractionsSortAndFilter = {
    sortOptions: [
        ...createAlphabeticalSortOptions(),
        ...createPriceSortOptions(),
    ],
    filterOptions: [
        createPriceRangeFilter("price", [
            { label: "Under ₹500", value: "under500", max: 500 },
            { label: "Under ₹1000", value: "under1000", max: 1000 },
            { label: "Under ₹2000", value: "under2000", max: 2000 },
            { label: "Above ₹2000", value: "above2000" },
        ]),
    ],
};

export const staysSortAndFilter = {
    sortOptions: [
        ...createAlphabeticalSortOptions(),
        ...createPriceSortOptions(),
        ...createRatingSortOptions(),
    ],
    filterOptions: [
        createDistrictFilter(),
        createPriceRangeFilter("price", [
            { label: "Under ₹3,000", value: "under3000", max: 3000 },
            { label: "Under ₹5,000", value: "under5000", max: 5000 },
            { label: "Under ₹8,000", value: "under8000", max: 8000 },
            { label: "Under ₹12,000", value: "under12000", max: 12000 },
        ]),
        createRatingFilter(),
    ],
};

export const souvenirsSortAndFilter = {
    sortOptions: [
        ...createAlphabeticalSortOptions(),
        ...createPriceSortOptions(),
    ],
    filterOptions: [
        createPriceRangeFilter("price", [
            { label: "Under ₹100", value: "under100", max: 100 },
            { label: "Under ₹300", value: "under300", max: 300 },
            { label: "Under ₹500", value: "under500", max: 500 },
            { label: "Under ₹1000", value: "under1000", max: 1000 },
            { label: "Above ₹1000", value: "above1000" },
        ]),
    ],
};
