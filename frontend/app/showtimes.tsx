import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const API_URL = "http://192.168.1.226:5000/api/showtimes";

type Showtime = {
    showtime_id?: number;
    show_date: string;
    show_time: string;
    available_seats: number;
    price: number | string;
};

export default function Showtimes() {
    const { showId, showTitle } = useLocalSearchParams<{
        showId?: string;
        showTitle?: string;
    }>();
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
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

        const fetchShowtimes = async () => {
            if (!showId) {
                setError("Show was not selected");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}?showId=${encodeURIComponent(showId)}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.message || "Failed to load showtimes");
                }

                if (isMounted) {
                    setShowtimes(data);
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
                await fetchShowtimes();
            }
        };

        loadScreen();

        return () => {
            isMounted = false;
        };
    }, [showId]);

    const handleBookNow = (showtime: Showtime) => {
        console.log("Book showtime:", showtime.showtime_id);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
                <Text style={{ color: "black" }}>Loading showtimes...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
            <Text style={{ color: "black", fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                {showTitle || "Showtimes"}
            </Text>

            {error ? (
                <Text style={{ color: "black" }}>{error}</Text>
            ) : (
                <ScrollView>
                    {showtimes.map((showtime, index) => (
                        <View
                            key={showtime.showtime_id ?? index}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                padding: 15,
                                marginBottom: 12,
                            }}
                        >
                            <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
                                Date: {showtime.show_date}
                            </Text>
                            <Text style={{ color: "black", marginTop: 6 }}>
                                Time: {showtime.show_time}
                            </Text>
                            <Text style={{ color: "black", marginTop: 6 }}>
                                Available seats: {showtime.available_seats}
                            </Text>
                            <Text style={{ color: "black", marginTop: 6 }}>
                                Price: {showtime.price}
                            </Text>
                            <TouchableOpacity
                                onPress={() => handleBookNow(showtime)}
                                style={{
                                    backgroundColor: "blue",
                                    padding: 12,
                                    marginTop: 12,
                                }}
                            >
                                <Text style={{ color: "white", textAlign: "center" }}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
