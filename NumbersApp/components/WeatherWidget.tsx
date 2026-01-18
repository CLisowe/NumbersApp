import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/theme";

type ForecastMode = "current" | "tomorrow" | "twoDays";

type WeatherData = {
  currentTempF: number | null;
  currentCode: number | null;

  daily: {
    dates: string[]; 
    tmaxF: number[];
    tminF: number[];
    codes: number[];
  } | null;
};

function mapWeatherCode(code: number): { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap } {

  if (code === 0) return { label: "Clear", icon: "weather-sunny" };
  if ([1, 2, 3].includes(code)) return { label: "Partly cloudy", icon: "weather-partly-cloudy" };
  if ([45, 48].includes(code)) return { label: "Fog", icon: "weather-fog" };
  if ([51, 53, 55].includes(code)) return { label: "Drizzle", icon: "weather-rainy" };
  if ([61, 63, 65].includes(code)) return { label: "Rain", icon: "weather-pouring" };
  if ([66, 67].includes(code)) return { label: "Freezing rain", icon: "weather-hail" };
  if ([71, 73, 75, 77].includes(code)) return { label: "Snow", icon: "weather-snowy" };
  if ([80, 81, 82].includes(code)) return { label: "Showers", icon: "weather-rainy" };
  if ([85, 86].includes(code)) return { label: "Snow showers", icon: "weather-snowy-heavy" };
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: "weather-lightning" };
  return { label: `Weather (${code})`, icon: "weather-cloudy" };
}

export default function WeatherWidget() {
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const [mode, setMode] = useState<ForecastMode>("current");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherData>({
    currentTempF: null,
    currentCode: null,
    daily: null,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.md,
          gap: spacing.md,
        },
        topRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.md,
        },
        title: {
          fontSize: fontSize.lg,
          fontWeight: "900",
          color: colors.text,
        },
        pills: {
          flexDirection: "row",
          gap: spacing.sm,
        },
        pill: {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
        },
        pillActive: {
          backgroundColor: colors.tint,
          borderColor: colors.tint,
        },
        pillText: {
          color: colors.text,
          fontWeight: "800",
          fontSize: fontSize.sm,
        },
        pillTextActive: {
          color: colors.background,
        },
        contentRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
        },
        bigTemp: {
          fontSize: fontSize.xl,
          fontWeight: "900",
          color: colors.text,
        },
        small: {
          fontSize: fontSize.md,
          fontWeight: "700",
          color: colors.icon,
        },
        error: {
          color: colors.danger,
          fontWeight: "800",
        },
      }),
    [colors, spacing, radius, fontSize]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude;
        const lon = loc.coords.longitude;

        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weather_code` +
          `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
          `&forecast_days=3` +
          `&temperature_unit=fahrenheit` +
          `&timezone=auto`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

        const json = await res.json();

        setData({
          currentTempF: typeof json?.current?.temperature_2m === "number" ? json.current.temperature_2m : null,
          currentCode: typeof json?.current?.weather_code === "number" ? json.current.weather_code : null,
          daily: json?.daily
            ? {
                dates: json.daily.time ?? [],
                tmaxF: json.daily.temperature_2m_max ?? [],
                tminF: json.daily.temperature_2m_min ?? [],
                codes: json.daily.weather_code ?? [],
              }
            : null,
        });
      } catch (e: any) {
        setError(e?.message ?? "Weather error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pill = (label: string, value: ForecastMode) => {
    const active = mode === value;
    return (
      <Pressable
        key={value}
        style={[styles.pill, active && styles.pillActive]}
        onPress={() => setMode(value)}
      >
        <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
      </Pressable>
    );
  };

  const renderWeather = () => {
    if (loading) return <ActivityIndicator />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    if (mode === "current") {
      const temp = data.currentTempF;
      const code = data.currentCode;

      if (temp == null || code == null) return <Text style={styles.error}>No current weather</Text>;

      const mapped = mapWeatherCode(code);
      return (
        <View style={styles.contentRow}>
          <MaterialCommunityIcons name={mapped.icon} size={42} color={colors.text} />
          <View>
            <Text style={styles.bigTemp}>{Math.round(temp)}°F</Text>
            <Text style={styles.small}>{mapped.label}</Text>
          </View>
        </View>
      );
    }

    const idx = mode === "tomorrow" ? 1 : 2;
    const d = data.daily;
    if (!d || d.dates.length <= idx) return <Text style={styles.error}>No forecast data</Text>;

    const code = Number(d.codes[idx] ?? -1);
    const mapped = mapWeatherCode(code);

    const hi = d.tmaxF[idx] != null ? Math.round(d.tmaxF[idx]) : null;
    const lo = d.tminF[idx] != null ? Math.round(d.tminF[idx]) : null;

    const label = mode === "tomorrow" ? "Tomorrow" : "In 2 days";

    return (
      <View style={styles.contentRow}>
        <MaterialCommunityIcons name={mapped.icon} size={42} color={colors.text} />
        <View>
          <Text style={styles.bigTemp}>
            {label}: {hi ?? "—"}° / {lo ?? "—"}°
          </Text>
          <Text style={styles.small}>{mapped.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.pills}>
          {pill("Current", "current")}
          {pill("Tomorrow", "tomorrow")}
          {pill("+2 Days", "twoDays")}
        </View>
      </View>

      {renderWeather()}
    </View>
  );
}
