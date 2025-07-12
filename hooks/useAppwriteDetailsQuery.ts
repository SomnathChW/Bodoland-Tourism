import { useQuery, QueryKey } from "@tanstack/react-query";
import { fetchDetails } from "./appwriteQuery";

interface FetchDetailsResponse<T> {
    data: T;
}

interface UseAppwriteDetailsQueryParams<TQueryKey extends QueryKey = QueryKey> {
    queryKey: TQueryKey;
    type: string;
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
    type,
    identifier,
    expectedFields = [],
    staleTime = 30 * 60 * 1000, // 30 minutes
    storeToUpdate,
}: UseAppwriteDetailsQueryParams<TQueryKey>) => {
    // Include identifier in the query key to ensure unique caching
    const QueryKey = [...queryKey,type, identifier];

    return useQuery<FetchDetailsResponse<T>>({
        queryKey: QueryKey,
        queryFn: () =>
            fetchDetails<T>({ type, identifier, expectedFields, storeToUpdate }),
        staleTime,
        retry: (failureCount) => failureCount < 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
