// import { useAuth } from "@/context/AuthContext";
import { useInfiniteQuery, QueryKey } from "@tanstack/react-query";
import { fetchPaginatedData } from "./appwriteQuery";

// Define the response type to match fetchData's return type
interface FetchDataResponse<T> {
    data: T[];
    nextPage?: number | null;
}

interface UseAppwriteInfiniteQueryParams<
    T extends Record<string, any> = Record<string, any>,
    TQueryKey extends QueryKey = QueryKey
> {
    queryKey: TQueryKey;
    route: string;
    limit?: number;
    expectedFields?: string[];
    queryVariables?: Record<string, any>;
    initialPageParam?: number;
    staleTime?: number;
    getNextPageParam?: (lastPage: FetchDataResponse<T>) => number | undefined;
}

export const useAppwriteInfiniteQuery = <
    T extends Record<string, any> = Record<string, any>,
    TQueryKey extends QueryKey = QueryKey
>({
    queryKey,
    route,
    limit = 20,
    expectedFields = [],
    initialPageParam = 1,
    staleTime = 30 * 60 * 1000, // 30 minutes
    getNextPageParam = (lastPage: FetchDataResponse<T>) =>
        lastPage.nextPage ?? undefined,
}: UseAppwriteInfiniteQueryParams<T, TQueryKey>) => {
    //const { signOut } = useAuth();

    const QueryKey = [...queryKey, route];

    return useInfiniteQuery<FetchDataResponse<T>>({
        queryKey: QueryKey,
        queryFn: ({ pageParam = initialPageParam }) =>
            fetchPaginatedData<T>({
                pageParam: pageParam as number,
                route,
                limit,
                expectedFields,
            }),
        initialPageParam,
        getNextPageParam,
        staleTime,
        retry: (failureCount) => failureCount < 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
