const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { Models } from "react-native-appwrite";

const mockData: {
    session: Models.Session | null;
    user: Models.User<{}> | null;
} = {
    session: {
        $createdAt: "2025-03-21T16:05:30.054+00:00",
        $id: "67dd8e4a0b03247c4714",
        $updatedAt: "2025-03-21T16:05:30.054+00:00",
        clientCode: "",
        clientEngine: "",
        clientEngineVersion: "",
        clientName: "OkHttp",
        clientType: "library",
        clientVersion: "4.9",
        countryCode: "in",
        countryName: "India",
        current: true,
        deviceBrand: "",
        deviceModel: "",
        deviceName: "",
        expire: "2026-03-21T16:05:30.045+00:00",
        factors: ["password"],
        ip: "103.163.192.64",
        mfaUpdatedAt: "",
        osCode: "AND",
        osName: "Android",
        osVersion: "",
        provider: "email",
        providerAccessToken: "",
        providerAccessTokenExpiry: "",
        providerRefreshToken: "",
        providerUid: "test@test.com",
        secret: "",
        userId: "67dd24c6000c55a0fb32",
    },
    user: {
        $createdAt: "2025-03-21T08:35:18.269+00:00",
        $id: "67dd24c6000c55a0fb32",
        $updatedAt: "2025-03-21T08:35:18.269+00:00",
        accessedAt: "2025-03-21T08:35:18.265+00:00",
        email: "test@test.com",
        emailVerification: false,
        labels: [],
        mfa: false,
        name: "Somnath",
        passwordUpdate: "2025-03-21T08:35:18.265+00:00",
        phone: "",
        phoneVerification: false,
        prefs: {},
        registration: "2025-03-21T08:35:18.265+00:00",
        status: true,
        targets: [
            {
                $createdAt: "2025-03-21T08:35:18.340+00:00",
                $id: "67dd24c6530cc18db567",
                $updatedAt: "2025-03-21T08:35:18.340+00:00",
                expired: false,
                identifier: "test@test.com",
                name: "",
                providerId: undefined,
                providerType: "email",
                userId: "67dd24c6000c55a0fb32",
            },
        ],
    },
};

export const mockAccount = {
    getSession: async (): Promise<Models.Session | null> => {
        await delay(3000);
        return mockData.session;
    },
    get: async (): Promise<Models.User<{}> | null> => {
        await delay(3000);
        return mockData.user;
    },
    createEmailPasswordSession: async (
        email: string,
        password: string
    ): Promise<Models.Session | null> => {
        await delay(3000);
        return mockData.session;
    },
    create: async (
        id: string,
        email: string,
        password: string,
        name: string
    ): Promise<{ id: string; email: string; name: string }> => {
        await delay(3000);
        return { id, email, name };
    },
    deleteSession: async (): Promise<void> => {
        await delay(3000);
    },
};
