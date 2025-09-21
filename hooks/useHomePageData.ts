import { useQuery } from "@tanstack/react-query";
import { fetchHomePageData } from "./appwriteQuery";

export interface HomePageItem {
    identifier: string;
    name: string;
    image: string;
    long_description?: string;
    short_description?: string;
    location?: string;
    tour_resource?: string;
    description?: string;
    type?: string;
    tag?: string;
}

export interface HomePageDataSection {
    items: HomePageItem[];
    total_count: number;
    fetched_count: number;
}

export interface HomePageApiResponse {
    success: boolean;
    error: null | string;
    timestamp: string;
    data: {
        attractions: HomePageDataSection;
        souvenirs: HomePageDataSection;
        virtual_tours?: HomePageDataSection;
        featured: HomePageDataSection;
        festivals?: HomePageDataSection;
        cuisines?: HomePageDataSection;
        districts?: HomePageDataSection;
    };
}

export interface UseHomePageDataParams {
    attractionsLimit?: number;
    souvenirsLimit?: number;
    virtualToursLimit?: number;
    featuredLimit?: number;
    festivalsLimit?: number;
    cuisinesLimit?: number;
    districtsLimit?: number;
    staleTime?: number;
}

export const useHomePageData = ({
    attractionsLimit = 5,
    souvenirsLimit = 5,
    virtualToursLimit = 5,
    featuredLimit = 20,
    festivalsLimit = 5,
    cuisinesLimit = 5,
    districtsLimit = 5,
    staleTime = 30 * 60 * 1000, // 30 minutes
}: UseHomePageDataParams = {}) => {
    return useQuery<HomePageApiResponse>({
        queryKey: [
            "homePage",
            {
                attractionsLimit,
                souvenirsLimit,
                virtualToursLimit,
                featuredLimit,
                festivalsLimit,
                cuisinesLimit,
                districtsLimit,
            },
        ],
        queryFn: () =>
            fetchHomePageData({
                attractionsLimit,
                souvenirsLimit,
                virtualToursLimit,
                featuredLimit,
                festivalsLimit,
                cuisinesLimit,
                districtsLimit,
            }),
        staleTime,
        retry: (failureCount) => failureCount < 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnMount: false, // Don't refetch on mount if data is fresh
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnReconnect: true, // Refetch on network reconnect
    });
};
