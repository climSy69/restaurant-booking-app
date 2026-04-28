import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Central API configuration.
 * Resolution order:
 *   1. EXPO_PUBLIC_API_URL from .env (manual override)
 *   2. Auto-detect from Expo Metro bundler hostUri (works on home/uni/hotspot)
 *   3. localhost fallback (web/dev only)
 */

const BACKEND_PORT = 5000;

function resolveApiBaseUrl(): string {
    // Priority 1: explicit override from .env
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl && envUrl.trim().length > 0) {
        return envUrl.replace(/\/+$/, "");
    }

    // Priority 2: auto-detect from Expo Metro bundler
    const hostUri =
        Constants.expoConfig?.hostUri ??
        // @ts-ignore - legacy fallback for older Expo SDKs
        Constants.manifest?.debuggerHost ??
        // @ts-ignore
        Constants.manifest2?.extra?.expoGo?.debuggerHost;

    if (hostUri && typeof hostUri === "string") {
        const host = hostUri.split(":")[0];
        if (host && host.length > 0) {
            return `http://${host}:${BACKEND_PORT}`;
        }
    }

    // Priority 3: last-resort fallback
    if (Platform.OS === "web") {
        return `http://localhost:${BACKEND_PORT}`;
    }
    return `http://127.0.0.1:${BACKEND_PORT}`;
}

export const API_BASE_URL = resolveApiBaseUrl();

// Helpful log on startup so you can see which URL is being used
if (__DEV__) {
    console.log("[API] Base URL resolved to:", API_BASE_URL);
}
