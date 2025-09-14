import { functions } from "@/lib/appwrite";
import { ExecutionMethod } from "react-native-appwrite";
import { useDataStore } from "@/store/useDataStore";
import type {
    HomePageApiResponse,
    UseHomePageDataParams,
} from "./useHomePageData";

export const fetchPaginatedData = async <T extends Record<string, any>>({
    pageParam = 1,
    limit,
    route,
    expectedFields = [] as string[],
    storeToUpdate,
}: {
    pageParam: number;
    limit: number;
    route: string;
    expectedFields?: string[];
    storeToUpdate?: string;
}): Promise<{
    data: T[];
    nextPage?: number | null;
}> => {
    try {
        const response = await functions.createExecution(
            process.env.EXPO_PUBLIC_FUNCTION_DATA as string,
            JSON.stringify({}),
            false,
            `/v1/${route}?page=${pageParam}&limit=${limit}`,
            ExecutionMethod.GET,
            {}
        );

        const statusCode = response.responseStatusCode;

        if (statusCode !== 200) {
            throw new Error(
                `Error fetching data: ${response.responseBody} (Status Code: ${statusCode})`
            );
        }

        // Parse the responseBody JSON string
        const parsedBody = JSON.parse(response.responseBody);

        const data = parsedBody.data || [];

        // Validate expected fields if specified
        if (expectedFields.length > 0 && data.length > 0) {
            // Check if first item has all expected fields
            const missingFields = expectedFields.filter(
                (field) => data[0][field] === undefined
            );

            if (missingFields.length > 0) {
                throw new Error(
                    `Response missing expected fields: ${missingFields.join(
                        ", "
                    )}`
                );
            }
        }

        // If storeToUpdate is provided, append data to the store
        if (storeToUpdate) {
            const store = useDataStore.getState();
            store.appendToData(
                storeToUpdate as keyof ReturnType<typeof useDataStore>,
                data
            );
        }

        return {
            data: data as T[],
            nextPage: parsedBody.nextPage ?? null,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetchData = async <T extends Record<string, any>>({
    route,
    expectedFields = [] as string[],
    limit = 20,
    storeToUpdate,
}: {
    route: string;
    expectedFields?: string[];
    limit?: number;
    storeToUpdate?: string;
}): Promise<{
    data: T[];
}> => {
    try {
        const response = await functions.createExecution(
            process.env.EXPO_PUBLIC_FUNCTION_DATA as string,
            JSON.stringify({}),
            false,
            `/v1/${route}?limit=${limit}`,
            ExecutionMethod.GET,
            {}
        );

        const statusCode = response.responseStatusCode;

        if (statusCode !== 200) {
            throw new Error(
                `Error fetching data: ${response.responseBody} (Status Code: ${statusCode})`
            );
        }

        // Parse the responseBody JSON string
        const parsedBody = JSON.parse(response.responseBody);

        const data = parsedBody.data || [];

        // Validate expected fields if specified
        if (expectedFields.length > 0 && data.length > 0) {
            // Check if first item has all expected fields
            const missingFields = expectedFields.filter(
                (field) => data[0][field] === undefined
            );

            if (missingFields.length > 0) {
                throw new Error(
                    `Response missing expected fields: ${missingFields.join(
                        ", "
                    )}`
                );
            }
        }

        // If storeToUpdate is provided, append data to the store (instead of replacing it)
        if (storeToUpdate) {
            const store = useDataStore.getState();
            store.appendToData(
                storeToUpdate as keyof ReturnType<typeof useDataStore>,
                data
            );
            console.log(`[Store Updated] appendToData: ${storeToUpdate}`, {
                count: data.length,
                firstItem: data.length > 0 ? data[0] : null,
            });
        }

        return {
            data: data as T[],
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetchDetails = async <T extends Record<string, any>>({
    type,
    identifier,
    expectedFields = [] as string[],
    storeToUpdate,
}: {
    type: string;
    identifier: string;
    expectedFields?: string[];
    storeToUpdate?: string;
}): Promise<{
    data: T;
}> => {
    try {
        const response = await functions.createExecution(
            process.env.EXPO_PUBLIC_FUNCTION_DATA as string,
            JSON.stringify({}),
            false,
            `/v1/details?type=${type}&identifier=${identifier}`,
            ExecutionMethod.GET,
            {}
        );

        const statusCode = response.responseStatusCode;

        if (statusCode !== 200) {
            throw new Error(
                `Error fetching details: ${response.responseBody} (Status Code: ${statusCode})`
            );
        }

        // Parse the responseBody JSON string
        const parsedBody = JSON.parse(response.responseBody);

        const data = parsedBody.data || {};

        // Validate expected fields if specified
        if (expectedFields.length > 0) {
            // Check if item has all expected fields
            const missingFields = expectedFields.filter(
                (field) => data[field] === undefined
            );

            if (missingFields.length > 0) {
                throw new Error(
                    `Response missing expected fields: ${missingFields.join(
                        ", "
                    )}`
                );
            }
        }

        // If storeToUpdate is provided, add data to the store
        if (storeToUpdate) {
            const store = useDataStore.getState();
            store.addToData(
                storeToUpdate as keyof ReturnType<typeof useDataStore>,
                data
            );
            console.log(`[Store Updated] addToData: ${storeToUpdate}`, {
                itemIdentifier: identifier,
                item: data,
            });
        }

        return {
            data: data as T,
        };
    } catch (error) {
        console.error("Error fetching details:", error);
        throw error;
    }
};

export const fetchHomePageData = async ({
    attractionsLimit = 5,
    souvenirsLimit = 5,
    virtualToursLimit = 5,
    featuredLimit = 20,
    festivalsLimit = 5,
    cuisinesLimit = 5,
    staleTime = 30 * 60 * 1000, // Not used here but kept because it's part of the params interface to reduce making another interface
}: UseHomePageDataParams): Promise<HomePageApiResponse> => {
    try {
        const queryParams = new URLSearchParams({
            attractions_limit: attractionsLimit.toString(),
            souvenirs_limit: souvenirsLimit.toString(),
            virtual_tours_limit: virtualToursLimit.toString(),
            featured_limit: featuredLimit.toString(),
            festivals_limit: festivalsLimit.toString(),
            cuisines_limit: cuisinesLimit.toString(),
        });

        const response = await functions.createExecution(
            process.env.EXPO_PUBLIC_FUNCTION_DATA as string,
            JSON.stringify({}),
            false,
            `/v1/home?${queryParams.toString()}`,
            ExecutionMethod.GET,
            {}
        );

        const statusCode = response.responseStatusCode;

        if (statusCode !== 200) {
            throw new Error(
                `Error fetching home page data: ${response.responseBody} (Status Code: ${statusCode})`
            );
        }

        // Parse the responseBody JSON string
        const parsedBody: HomePageApiResponse = JSON.parse(
            response.responseBody
        );

        if (!parsedBody.success) {
            throw new Error(
                parsedBody.error || "Failed to fetch home page data"
            );
        }

        return parsedBody;
    } catch (error) {
        console.error("Error fetching home page data:", error);
        throw error;
    }
};
