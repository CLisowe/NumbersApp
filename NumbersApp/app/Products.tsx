import React, { useCallback, useMemo, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/theme";

import SearchBar from "../components/SearchBar";
import PullToRefreshList from "../components/PullToRefreshList";
import ProductCard from "../components/ProductCard";
import CreateProductButton from "@/components/CreateProductButton";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "@/components/HamburgerMenu";

import { createProduct, deleteProduct } from "../lib/products";
import { useProducts } from "@/components/ProductProvider";
import { ImportProductsCsvButton } from "@/components/importProductsCsvButton";
import { getProductMenuItems } from "@/lib/hamburgerMenu";
export default function Products() {
  const { colors, spacing } = useAppTheme();

  const { products, refresh, updateProduct, removeProduct } = useProducts();

  const [query, setQuery] = useState("");

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const onCreate = useCallback(
    async (p: { name: string; quantity: number }) => {
      await createProduct(p.name, p.quantity);
      await refresh();
      setQuery("");
    },
    [refresh]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const nameMatch = (p.name ?? "").toLowerCase().includes(q);
      const qtyMatch = String(p.quantity ?? "").includes(q);
      return nameMatch || qtyMatch;
    });
  }, [products, query]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        searchWrap: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
        },
        listContent: {
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
        },
        rowGap: { height: spacing.md },
      }),
    [colors, spacing]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.searchWrap}>
          <HamburgerMenu
            title="Numbers App"
            subtitle="Products"
            items={getProductMenuItems()}
            enableProductCsvImport
          />
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search products" />
        </View>

        <PullToRefreshList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.rowGap} />}
          keyboardShouldPersistTaps="handled"
          onRefreshAsync={refresh}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onUpdate={async (next) => {
                try {

                  await updateProduct(next);
                  return { ok: true as const };
                } catch (e: any) {
                  return { ok: false as const, error: e?.message ?? "Update failed" };
                }
              }}
              onDelete={async (id) => {
                try {
                  await deleteProduct(id);

                  removeProduct(id);

                  return { ok: true as const };
                } catch (e: any) {
                  return { ok: false as const, error: e?.message ?? "Delete failed" };
                }
              }}
            />
          )}
        />

        <CreateProductButton onCreate={onCreate} />
      </View>
    </SafeAreaView>
  );
}
