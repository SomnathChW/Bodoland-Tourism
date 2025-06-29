# Dynamic Sort and Filter System

This project now includes a flexible and reusable sorting and filtering system that can be easily applied to any page displaying lists of data.

## Features

-   **Dynamic Sorting**: Sort data by any field (alphabetical, numerical, custom comparisons)
-   **Dynamic Filtering**: Filter data by categories, price ranges, ratings, etc.
-   **Reusable**: Can be applied to any page with minimal code
-   **Preset Configurations**: Common configurations for different content types
-   **Visual Feedback**: Shows active filters and sort options
-   **Reset Functionality**: Clear all filters and sorting

## Components

### 1. `useSortFilter` Hook

Located at: `/hooks/useSortFilter.ts`

A custom hook that manages sorting and filtering logic.

```typescript
const {
    sortedAndFilteredData, // The processed data
    activeSortId, // Current sort option ID
    setActiveSortId, // Function to change sort
    activeFilters, // Current filter values
    setActiveFilters, // Function to change filters
    sortModalVisible, // Sort modal visibility
    setSortModalVisible, // Toggle sort modal
    filterModalVisible, // Filter modal visibility
    setFilterModalVisible, // Toggle filter modal
    resetFilters, // Reset all filters and sorting
} = useSortFilter({
    data: yourData,
    sortOptions: sortOptionsArray,
    filterOptions: filterOptionsArray,
});
```

### 2. `DynamicSortFilterComponent`

Located at: `/components/UI/Header/DynamicSortFilterComponent.tsx`

A reusable UI component that provides the sorting and filtering interface.

### 3. Sort and Filter Configurations

Located at: `/utils/sortFilterConfigs.ts`

Preset configurations and utility functions for common use cases.

## Sort Options

Define how data should be sorted:

```typescript
const sortOptions: SortOption[] = [
    {
        id: "alphabetical",
        label: "Alphabetical (A-Z)",
        getValue: (item) => item.name,
    },
    {
        id: "price-high-low",
        label: "Price: High to Low",
        getValue: (item) => Number(item.price || 0),
        compare: (a, b) => b - a, // Custom comparison
    },
];
```

## Filter Options

Define how data should be filtered:

```typescript
const filterOptions: FilterOption[] = [
    {
        id: "priceRange",
        label: "Price Range",
        type: "select",
        getValue: (item) => {
            const price = Number(item.price || 0);
            if (price < 500) return "under500";
            if (price < 1000) return "under1000";
            return "above1000";
        },
        options: [
            { label: "All Prices", value: "all" },
            { label: "Under ₹500", value: "under500" },
            { label: "Under ₹1000", value: "under1000" },
            { label: "Above ₹1000", value: "above1000" },
        ],
    },
];
```

## Usage Examples

### Basic Implementation

```typescript
import { useSortFilter } from "@/hooks/useSortFilter";
import DynamicSortFilterComponent from "@/components/UI/Header/DynamicSortFilterComponent";

const MyPage = () => {
    const sortOptions = [
        {
            id: "alphabetical",
            label: "Alphabetical (A-Z)",
            getValue: (item) => item.name,
        },
    ];

    const {
        sortedAndFilteredData,
        activeSortId,
        setActiveSortId,
        // ... other values
    } = useSortFilter({
        data: myData,
        sortOptions,
        filterOptions: [], // Optional
    });

    return (
        <View>
            <DynamicSortFilterComponent
                sortOptions={sortOptions}
                filterOptions={[]}
                activeSortId={activeSortId}
                setActiveSortId={setActiveSortId}
                // ... other props
            />

            <FlatList
                data={sortedAndFilteredData}
                renderItem={({ item }) => <MyCard item={item} />}
            />
        </View>
    );
};
```

### Using Preset Configurations

```typescript
import { attractionsSortAndFilter } from "@/utils/sortFilterConfigs";

const {
    sortedAndFilteredData,
    // ... other values
} = useSortFilter({
    data: attractionsData,
    sortOptions: attractionsSortAndFilter.sortOptions,
    filterOptions: attractionsSortAndFilter.filterOptions,
});
```

## Available Preset Configurations

-   `attractionsSortAndFilter`: For tourist attractions
-   `staysSortAndFilter`: For hotels and accommodations (includes district filter)
-   `souvenirsSortAndFilter`: For souvenir and shopping items

## Design Features

-   **Monochrome Theme**: Clean white and gray styling that matches your app
-   **Chip-Style Filters**: Horizontal filter options arranged like chips
-   **Visual Feedback**: Active filters show with white background and black text
-   **Responsive Layout**: Filter chips wrap to next line when needed

## Utility Functions

### Create Common Sort Options

-   `createAlphabeticalSortOptions(nameKey)`: A-Z and Z-A sorting
-   `createPriceSortOptions(priceKey)`: Price low-to-high and high-to-low
-   `createRatingSortOptions(ratingKey)`: Rating sorting

### Create Common Filter Options

-   `createPriceRangeFilter(priceKey, ranges)`: Price range filtering
-   `createRatingFilter(ratingKey)`: Rating-based filtering
-   `createDistrictFilter(districtKey)`: BTR district-based filtering

## How It Works

1. **Data Processing**: The hook takes your original data and applies active filters and sorting
2. **State Management**: Manages all UI state for modals and active selections
3. **Rendering**: The component provides a consistent UI across all pages
4. **Updates**: When users change filters or sorting, the data is automatically reprocessed

## Benefits

-   **Consistent UX**: Same interface across all pages
-   **Easy to Implement**: Just a few lines of code per page
-   **Flexible**: Supports any data structure and sorting/filtering logic
-   **Maintainable**: Centralized logic makes updates easy
-   **Performance**: Uses React's useMemo for efficient re-rendering

## Adding to New Pages

1. Import the necessary modules
2. Define or use preset sort/filter options
3. Use the `useSortFilter` hook
4. Add the `DynamicSortFilterComponent` to your JSX
5. Use `sortedAndFilteredData` in your list component

That's it! Your page now has full sorting and filtering capabilities.
