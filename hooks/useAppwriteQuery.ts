import { useQuery, QueryKey } from "@tanstack/react-query";
import { fetchData } from "./appwriteQuery";

interface FetchDataResponse<T> {
    data: T[];
}

interface UseAppwriteQueryParams<TQueryKey extends QueryKey = QueryKey> {
    queryKey: TQueryKey;
    route: string;
    limit?: number;
    expectedFields?: string[];
    staleTime?: number;
}

export const useAppwriteQuery = <
    T extends Record<string, any> = Record<string, any>,
    TQueryKey extends QueryKey = QueryKey
>({
    queryKey,
    route,
    limit = 20,
    expectedFields = [],
    staleTime = 30 * 60 * 1000, // 30 minutes
}: UseAppwriteQueryParams<TQueryKey>) => {
    const QueryKey = [...queryKey, route];

    return useQuery<FetchDataResponse<T>>({
        queryKey: QueryKey,
        queryFn: () => fetchData<T>({ route, expectedFields, limit }),
        staleTime,
        retry: (failureCount) => failureCount < 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
