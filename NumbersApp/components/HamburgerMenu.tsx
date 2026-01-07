import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

type MenuItem = {
  label: string;
  onPress: () => void;
};

type Props = {
  title?: string;
  subtitle?: string;
  items: MenuItem[];
  showLogout?: boolean; 
};

export default function HamburgerMenu({
  title,
  subtitle,
  items,
  showLogout = true, 
}: Props) {
  const { colors, spacing, radius, fontSize } = useAppTheme();
  const [open, setOpen] = useState(false);

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
          backgroundColor: colors.background,
          borderRightWidth: 1,
          borderRightColor: colors.border,
          paddingHorizontal: spacing.lg,

          paddingTop: spacing.md,
          paddingBottom: spacing.lg,

   
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
          marginTop: spacing.md,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        logoutText: {
          color: colors.text,
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

  return (
    <>
      {/* Header */}
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

      {/* Menu */}
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

            {items.map((item) => (
              <Pressable
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  setOpen(false);
                  item.onPress();
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
