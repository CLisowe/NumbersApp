import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.log("getSession error:", error);

        if (!alive) return;
        setSession(data?.session ?? null);
      } catch (e) {
        console.log("getSession threw:", e);
        if (!alive) return;
        setSession(null);
      } finally {
        if (!alive) return;
        setReady(true);
      }
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      alive = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const inAuthScreen = segments[0] === "authScreen"; // because your auth screen is /authScreen

    if (!session && !inAuthScreen) {
      router.replace("/authScreen");
    }

    if (session && inAuthScreen) {
      router.replace("/");
    }
  }, [ready, session, segments]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="authScreen" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
