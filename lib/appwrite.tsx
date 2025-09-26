//@ts-nocheck
// Ignore the env variables

import { Platform } from "react-native";
import {
    Account,
    Client,
    Functions,
    ID,
    OAuthProvider,
    TablesDB,
} from "react-native-appwrite";

if (
    !process.env.EXPO_PUBLIC_ENDPOINT ||
    !process.env.EXPO_PUBLIC_PROJECT_ID ||
    !process.env.EXPO_PUBLIC_ANDROID_PLATFORM ||
    !process.env.EXPO_PUBLIC_IOS_PLATFORM
) {
    console.error("Please set the environment variables in .env file");
}

const appwrite_endpoint = process.env.EXPO_PUBLIC_ENDPOINT;
const appwrite_project = process.env.EXPO_PUBLIC_PROJECT_ID;
const appwrite_android_platform = process.env.EXPO_PUBLIC_ANDROID_PLATFORM;
const appwrite_ios_platform = process.env.EXPO_PUBLIC_IOS_PLATFORM;

const client = new Client()
    .setEndpoint(appwrite_endpoint)
    .setProject(appwrite_project);

if (process.env.EXPO_PUBLIC_DEV_KEY) {
    client.setDevKey(process.env.EXPO_PUBLIC_DEV_KEY);
}

switch (Platform.OS) {
    case "ios":
        client.setPlatform(appwrite_ios_platform);
        break;
    case "android":
        client.setPlatform(appwrite_android_platform);
        break;
}

const account = new Account(client);
const functions = new Functions(client);
const tablesdb = new TablesDB(client);

export { client, account, functions, ID, OAuthProvider, tablesdb };
