import { useMemo, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { FontSize, useAppTheme } from "@/theme/theme";
import HamburgerMenu from "@/components/HamburgerMenu";
import FavoriteSummaryRow from "@/components/FavoriteSummary";
import { SafeAreaView } from "react-native-safe-area-context";
import WeatherWidget from "@/components/WeatherWidget";
import { useProducts } from "@/components/ProductProvider";
import { getProductMenuItems } from "@/lib/hamburgerMenu";

export default function LiveInventoryScreen() {
  const { colors, spacing, fontSize } = useAppTheme();

  const { products, refresh } = useProducts();

  useEffect(() => {
    refresh().catch(console.error); 
  }, [refresh]);

  const favorites = useMemo(
    () =>
      products
        .filter((p) => p.is_favorite)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          padding: spacing.lg,
          gap: spacing.lg,
        },
        favoritesWrap: {
          gap: spacing.md,
        },
        sectionTitle: {
          color: colors.icon, 
          fontSize: fontSize.lg, 
          fontWeight: "600",
        },
      }),
    [colors, spacing, fontSize]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={styles.container}>
        <HamburgerMenu
          title="Numbers App"
          subtitle="Overview"
          items={getProductMenuItems()}
          enableProductCsvImport
        />

        <WeatherWidget />

        <View style={styles.favoritesWrap}>
            <Text style={styles.sectionTitle}>Favorites</Text>
          {favorites.map((p) => (
            <FavoriteSummaryRow key={p.id} name={p.name} quantity={p.quantity} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
