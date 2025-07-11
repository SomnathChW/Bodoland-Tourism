import { useQuery, QueryKey } from "@tanstack/react-query";
import { fetchDetails } from "./appwriteQuery";

interface FetchDetailsResponse<T> {
    data: T;
}

interface UseAppwriteDetailsQueryParams<TQueryKey extends QueryKey = QueryKey> {
    queryKey: TQueryKey;
    route: string;
    identifier: string;
    expectedFields?: string[];
    staleTime?: number;
    storeToUpdate?: string;
}

export const useAppwriteDetailsQuery = <
    T extends Record<string, any> = Record<string, any>,
    TQueryKey extends QueryKey = QueryKey
>({
    queryKey,
    route,
    identifier,
    expectedFields = [],
    staleTime = 30 * 60 * 1000, // 30 minutes
    storeToUpdate,
}: UseAppwriteDetailsQueryParams<TQueryKey>) => {
    // Include identifier in the query key to ensure unique caching
    const QueryKey = [...queryKey, route, identifier];

    return useQuery<FetchDetailsResponse<T>>({
        queryKey: QueryKey,
        queryFn: () =>
            fetchDetails<T>({ route, identifier, expectedFields, storeToUpdate }),
        staleTime,
        retry: (failureCount) => failureCount < 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
