import { functions } from "@/lib/appwrite";
import { ExecutionMethod } from "react-native-appwrite";

export const fetchPaginatedData = async <T extends Record<string, any>>({
    pageParam = 1,
    limit,
    route,
    expectedFields = [] as string[],
}: {
    pageParam: number;
    limit: number;
    route: string;
    expectedFields?: string[];
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
}: {
    route: string;
    expectedFields?: string[];
    limit?: number;
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

        return {
            data: data as T[],
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
