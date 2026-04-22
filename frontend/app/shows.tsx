import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const API_URL = "http://192.168.1.226:5000/api/shows";

type Show = {
    show_id?: number;
    title: string;
    description: string;
    duration: number;
    age_rating: string;
};

export default function Shows() {
    const { theatreId, theatreName } = useLocalSearchParams<{
        theatreId?: string;
        theatreName?: string;
    }>();
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            const [[, savedToken], [, savedUser]] = await AsyncStorage.multiGet(["token", "user"]);

            if (isMounted && (!savedToken || !savedUser)) {
                router.replace("/login");
                return false;
            }

            return true;
        };

        const fetchShows = async () => {
            if (!theatreId) {
                setError("Theatre was not selected");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}?theatreId=${encodeURIComponent(theatreId)}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.message || "Failed to load shows");
                }

                if (isMounted) {
                    setShows(data);
                }
            } catch (fetchError: any) {
                if (isMounted) {
                    setError(fetchError?.message || "Could not reach the server");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const loadScreen = async () => {
            const hasSession = await loadSession();

            if (hasSession) {
                await fetchShows();
            }
        };

        loadScreen();

        return () => {
            isMounted = false;
        };
    }, [theatreId]);

    const handleViewShowtimes = (show: Show) => {
        if (!show.show_id) {
            return;
        }

        router.push({
            pathname: "/showtimes",
            params: {
                showId: String(show.show_id),
                showTitle: show.title,
            },
        });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
                <Text style={{ color: "black" }}>Loading shows...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
            <Text style={{ color: "black", fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                {theatreName || "Shows"}
            </Text>

            {error ? (
                <Text style={{ color: "black" }}>{error}</Text>
            ) : (
                <ScrollView>
                    {shows.map((show, index) => (
                        <View
                            key={show.show_id ?? index}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                padding: 15,
                                marginBottom: 12,
                            }}
                        >
                            <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
                                {show.title}
                            </Text>
                            <Text style={{ color: "black", marginTop: 6 }}>
                                {show.description}
                            </Text>
                            <Text style={{ color: "black", marginTop: 6 }}>
                                Duration: {show.duration} minutes
                            </Text>
                            <Text style={{ color: "black", marginTop: 6 }}>
                                Age rating: {show.age_rating}
                            </Text>
                            <TouchableOpacity
                                onPress={() => handleViewShowtimes(show)}
                                style={{
                                    backgroundColor: "blue",
                                    padding: 12,
                                    marginTop: 12,
                                }}
                            >
                                <Text style={{ color: "white", textAlign: "center" }}>View Showtimes</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
