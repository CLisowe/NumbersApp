import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "@/theme/theme";
import { useLocalSearchParams } from "expo-router";

import Overview from "./Overview";
import Products from "./Products";
import Orders from "./Orders";

export default function Index() {
  const { colors, spacing, radius } = useAppTheme();
  const pagerRef = useRef<PagerView>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const insets = useSafeAreaInsets();


  const { page } = useLocalSearchParams<{ page?: string }>();

  const pageCount = useMemo(() => 3, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: { flex: 1, backgroundColor: colors.background },
        pager: { flex: 1 },
        pageWrapper: { flex: 1, backgroundColor: colors.background },

        dotsRow: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: spacing.sm,
        },

        dot: {
          width: spacing.sm,
          height: spacing.sm,
          borderRadius: radius.sm,
          marginHorizontal: spacing.sm,
          backgroundColor: colors.dot,
        },
        dotActive: { opacity: 1, transform: [{ scale: 1.1 }] },
        dotInactive: { opacity: 0.35 },
      }),
    [colors, spacing, radius]
  );


  useEffect(() => {
    if (!page) return;

    const target =
      page === "Orders" ? 0 :
      page === "Overview" ? 1 :
      page === "Products" ? 2 :
      1;

    pagerRef.current?.setPage(target);
    setPageIndex(target);
  }, [page]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="light" />

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={1}
        onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
      >
        <View key="orders" style={styles.pageWrapper}>
          <Orders />
        </View>

        <View key="overview" style={styles.pageWrapper}>
          <Overview />
        </View>

        <View key="products" style={styles.pageWrapper}>
          <Products />
        </View>
      </PagerView>

      <View
        style={[
          styles.dotsRow,
          { paddingBottom: Math.max(insets.bottom, spacing.sm) },
        ]}
      >
        {Array.from({ length: pageCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === pageIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
