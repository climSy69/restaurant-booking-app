import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

const normalizeToken = (token: unknown): string | null => {
    if (typeof token !== "string") return null;
    return token.replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();
};

type ApiOptions = RequestInit & {
    auth?: boolean;
    timeoutMs?: number;
};

/**
 * Centralized API client.
 * - Prepends API_BASE_URL automatically (pass only the path, e.g. "/api/theatres")
 * - Optionally attaches Bearer token from AsyncStorage when auth: true
 * - Adds JSON Content-Type when a body is present
 * - Adds a timeout to avoid hanging "Loading..." screens forever
 */
export async function apiFetch(path: string, options: ApiOptions = {}): Promise<Response> {
    const { auth = false, timeoutMs = 15000, headers, body, ...rest } = options;

    const url = path.startsWith("http")
        ? path
        : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

    const finalHeaders: Record<string, string> = {
        ...(headers as Record<string, string> | undefined),
    };

    if (body && !finalHeaders["Content-Type"]) {
        finalHeaders["Content-Type"] = "application/json";
    }

    if (auth) {
        const stored = await AsyncStorage.getItem("token");
        const token = normalizeToken(stored);
        if (token) {
            finalHeaders["Authorization"] = `Bearer ${token}`;
        }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...rest,
            body,
            headers: finalHeaders,
            signal: controller.signal,
        });
        return response;
    } finally {
        clearTimeout(timer);
    }
}

export { API_BASE_URL };
