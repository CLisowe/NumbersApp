import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useImportProductsCsv } from "@/lib/importProductsFromCsv";


type MenuItem = {
  label: string;
  onPress: () => void | Promise<void>;
};

type Props = {
  title?: string;
  subtitle?: string;
  items: MenuItem[];
  showLogout?: boolean;


  enableProductCsvImport?: boolean;


  onProductsImported?: () => void;
};

export default function HamburgerMenu({
  title,
  subtitle,
  items,
  showLogout = true,
  enableProductCsvImport = false,
  onProductsImported,
}: Props) {
  const { colors, spacing, radius, fontSize } = useAppTheme();
  const [open, setOpen] = useState(false);


  const { isImporting, importProductsCsv } = useImportProductsCsv();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          marginBottom: spacing.md,
        },
        hamburgerBtn: {
          width: 44,
          height: 44,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
        },
        hamburgerText: {
          fontSize: 22,
          fontWeight: "900",
          color: colors.text,
        },
        titleBlock: { flex: 1 },
        titleText: {
          fontSize: fontSize.xl,
          fontWeight: "800",
          color: colors.text,
        },
        subtitleText: {
          fontSize: fontSize.lg,
          fontWeight: "600",
          color: colors.icon,
        },
        modalBackdrop: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          flexDirection: "row",
        },
        sideMenu: {
          width: 280,
          flex:1, 
          backgroundColor: colors.background,
          borderRightWidth: 1,
          borderRightColor: colors.border,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        menuHeader: {
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginBottom: spacing.md,
        },
        menuTitle: {
          fontSize: fontSize.lg,
          fontWeight: "800",
          color: colors.text,
        },
        menuItem: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.sm,
        },
        menuItemText: {
          color: colors.text,
          fontWeight: "700",
        },
        logoutItem: {
          marginTop: spacing.lg,
          backgroundColor: colors.card,
          borderColor: colors.danger,
        },
        logoutText: {
          color: colors.danger,
          fontWeight: "800",
        },
        outsideTap: { flex: 1 },
      }),
    [colors, spacing, radius, fontSize]
  );

  const handleLogout = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    router.replace("/authScreen");
  };

  const handleImport = async () => {
    setOpen(false);

    const res = await importProductsCsv();

    if (
      res.totalRows === 0 &&
      res.validRows === 0 &&
      res.imported === 0 &&
      res.errors.length === 0
    ) {
      return;
    }

    if (res.errors.length) {
      const preview = res.errors
        .slice(0, 3)
        .map((e) => `Row ${e.row}: ${e.message}`)
        .join("\n");

      const more =
        res.errors.length > 3
          ? `\n… +${res.errors.length - 3} more`
          : "";

      Alert.alert(
        "Import finished (with issues)",
        `Total rows: ${res.totalRows}\nValid rows: ${res.validRows}\nImported: ${res.imported}\nSkipped: ${res.skipped}\n\n${preview}${more}`
      );
      return;
    }

    Alert.alert("Import complete", `Imported: ${res.imported}`);
    onProductsImported?.();
  };

  const menuItems: MenuItem[] = useMemo(() => {
    const base = [...items];

    if (enableProductCsvImport) {
      base.push({
        label: isImporting ? "Importing…" : "Import CSV",
        onPress: handleImport,
      });
    }

    return base;
  }, [items, enableProductCsvImport, isImporting]);

  return (
    <>

      <View style={styles.headerRow}>
        <Pressable
          style={styles.hamburgerBtn}
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={styles.hamburgerText}>≡</Text>
        </Pressable>

        {(title || subtitle) && (
          <View style={styles.titleBlock}>
            {title && <Text style={styles.titleText}>{title}</Text>}
            {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
          </View>
        )}
      </View>


      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.sideMenu} edges={["top", "left", "bottom"]}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
            </View>

            {menuItems.map((item) => (
              <Pressable
                key={item.label}
                style={styles.menuItem}
                disabled={isImporting && item.label.includes("Import")}
                onPress={async () => {
                  setOpen(false);
                  await Promise.resolve(item.onPress());
                }}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </Pressable>
            ))}

            {showLogout && (
              <Pressable
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Log out</Text>
              </Pressable>
            )}
          </SafeAreaView>

          <Pressable style={styles.outsideTap} onPress={() => setOpen(false)} />
        </View>
      </Modal>
    </>
  );
}
