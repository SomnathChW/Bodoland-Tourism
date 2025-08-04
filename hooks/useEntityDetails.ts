import { useEffect } from "react";
import { useDataStore, State } from "@/store/useDataStore";
import { useAppwriteDetailsQuery } from "./useAppwriteDetailsQuery";

interface UseEntityDetailsParams<T extends keyof State> {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
}

/**
 * Generic custom hook to fetch any entity details from store or Appwrite
 * @param identifier - The unique identifier for the entity
 * @param onDataFetched - Optional callback when data is successfully fetched
 * @param onError - Optional callback when an error occurs
 */
export const useEntityDetails = <T extends keyof State>({
    identifier,
    onDataFetched,
    onError,
}: UseEntityDetailsParams<T>) => {
    // Try to get the entity details based on the identifier from store
    const storeState = useDataStore.getState();
    // get the entity type from the generic type (split along - or _) and add an "s" at the end
    // this is to handle cases like "attraction-123" or "souvenir_456" to get "attractions" or "souvenirs"
    // because the store state and API is structured with plural keys
    const entityType = identifier.split(/[-_]/)[0].toLowerCase() + "s";

    const entityDetailsFromStore = storeState[entityType as keyof State]?.find(
        (entity: any) => entity.identifier === identifier
    );

    // Only fetch if not in store
    const { data, isLoading, error } = useAppwriteDetailsQuery({
        queryKey: [entityType, identifier],
        type: entityType.toString(),
        identifier: identifier,
        isEnabled: !entityDetailsFromStore, // Only fetch if not in store
    });

    const entityDetails = entityDetailsFromStore || data?.data;

    // Send data back to parent component when entity details are found
    useEffect(() => {
        if (entityDetails && onDataFetched) {
            onDataFetched(entityDetails);
        }

        if (error && onError) {
            onError();
        }
    }, [entityDetails, onDataFetched, error, onError]);

    return {
        entityDetails,
        isLoading,
        error,
    };
};

/**
 * Custom hook to fetch attraction details from store or Appwrite
 */
export const useAttractionDetails = ({
    identifier,
    onDataFetched,
    onError,
}: Omit<UseEntityDetailsParams<"attractions">, "entityType">) => {
    const result = useEntityDetails({
        identifier,
        onDataFetched,
        onError,
    });

    return {
        attractionDetails: result.entityDetails,
        isLoading: result.isLoading,
        error: result.error,
    };
};

/**
 * Custom hook to fetch souvenir details from store or Appwrite
 */
export const useSouvenirDetails = ({
    identifier,
    onDataFetched,
    onError,
}: Omit<UseEntityDetailsParams<"souvenirs">, "entityType">) => {
    const result = useEntityDetails({
        identifier,
        onDataFetched,
        onError,
    });

    return {
        souvenirDetails: result.entityDetails,
        isLoading: result.isLoading,
        error: result.error,
    };
};

/**
 * Custom hook to fetch cuisine details from store or Appwrite
 */
export const useCuisineDetails = ({
    identifier,
    onDataFetched,
    onError,
}: Omit<UseEntityDetailsParams<"cuisines">, "entityType">) => {
    const result = useEntityDetails({
        identifier,
        onDataFetched,
        onError,
    });

    return {
        cuisineDetails: result.entityDetails,
        isLoading: result.isLoading,
        error: result.error,
    };
};

/**
 * Custom hook to fetch festival details from store or Appwrite
 */
export const useFestivalDetails = ({
    identifier,
    onDataFetched,
    onError,
}: Omit<UseEntityDetailsParams<"festivals">, "entityType">) => {
    const result = useEntityDetails({
        identifier,
        onDataFetched,
        onError,
    });

    return {
        festivalDetails: result.entityDetails,
        isLoading: result.isLoading,
        error: result.error,
    };
};

/**
 * Custom hook to fetch hotel/stay details from store or Appwrite
 */
export const useHotelDetails = ({
    identifier,
    onDataFetched,
    onError,
}: Omit<UseEntityDetailsParams<"stays">, "entityType">) => {
    const result = useEntityDetails({
        identifier,
        onDataFetched,
        onError,
    });

    return {
        hotelDetails: result.entityDetails,
        isLoading: result.isLoading,
        error: result.error,
    };
};

/**
 * Custom hook to fetch virtual tour details from store or Appwrite
 */
export const useVirtualTourDetails = ({
    identifier,
    onDataFetched,
    onError,
}: Omit<UseEntityDetailsParams<"virtual_tours">, "entityType">) => {
    const result = useEntityDetails({
        identifier,
        onDataFetched,
        onError,
    });

    return {
        virtualTourDetails: result.entityDetails,
        isLoading: result.isLoading,
        error: result.error,
    };
};
