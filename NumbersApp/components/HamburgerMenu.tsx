import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/theme";

type MenuItem = {
  label: string;
  onPress: () => void;
};

type Props = {
  title?: string;
  subtitle?: string;
  items: MenuItem[];
};

export default function HamburgerMenu({
  title,
  subtitle,
  items,
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
          backgroundColor: "rgba(0,0,0,0.4)",
          flexDirection: "row",
        },
        sideMenu: {
          width: 260,
          backgroundColor: colors.background,
          borderRightWidth: 1,
          borderRightColor: colors.border,
          padding: spacing.lg,
        },
        menuTitle: {
          fontSize: fontSize.lg,
          fontWeight: "800",
          color: colors.text,
          marginBottom: spacing.md,
        },
        menuItem: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.sm,
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
        outsideTap: { flex: 1 },
      }),
    [colors, spacing, radius, fontSize]
  );

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
          <SafeAreaView style={styles.sideMenu} edges={["top"]}>
            <Text style={styles.menuTitle}>Menu</Text>

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
          </SafeAreaView>

          <Pressable
            style={styles.outsideTap}
            onPress={() => setOpen(false)}
          />
        </View>
      </Modal>
    </>
  );
}
