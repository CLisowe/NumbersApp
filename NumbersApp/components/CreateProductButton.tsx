import { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useAppTheme } from "@/theme/theme";

type NewProduct = {
  name: string;
  quantity: number;
};

type Props = {
  onCreate: (product: NewProduct) => void;
};

export default function CreateProductButton({ onCreate }: Props) {
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);

  // 0 = plus, 1 = x
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [open, anim]);

  const rotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"], // "+" rotated 45deg looks like "×"
  });

  const reset = () => {
    setName("");
    setQuantity(0);
  };

  const close = () => {
    setOpen(false);
  };

  const submit = () => {
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      quantity: Math.max(0, quantity),
    });

    reset();
    close();
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // ✅ FAB stays clickable above FlatList
        fab: {
          position: "absolute",
          right: spacing.lg,
          bottom: spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.tint,
          alignItems: "center",
          justifyContent: "center",

          // Make sure it is on top (Android + iOS)
          zIndex: 999,
          elevation: 12,

          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 4 },
        },
        plus: {
          fontSize: 30,
          fontWeight: "900",
          color: colors.background,
          lineHeight: 32,
        },

        backdrop: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: spacing.lg,
        },
        modal: {
          backgroundColor: colors.background,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        },
        title: {
          fontSize: fontSize.lg,
          fontWeight: "800",
          color: colors.text,
          marginBottom: spacing.md,
        },
        label: {
          color: colors.icon,
          fontWeight: "700",
          marginBottom: spacing.xs,
        },
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          color: colors.text,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          marginBottom: spacing.md,
        },
        actions: {
          flexDirection: "row",
          gap: spacing.sm,
          marginTop: spacing.md,
        },
        btn: {
          flex: 1,
          paddingVertical: spacing.sm,
          borderRadius: radius.md,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
        },
        btnPrimary: {
          backgroundColor: colors.tint,
          borderColor: colors.tint,
        },
        btnText: {
          fontWeight: "800",
          color: colors.text,
        },
        btnTextPrimary: {
          color: colors.background,
        },
      }),
    [colors, spacing, radius, fontSize]
  );

  return (
    <>
      {/* Floating + button (rotates to X when open) */}
      <Pressable
        style={styles.fab}
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={open ? "Close create product" : "Create product"}
      >
        <Animated.Text style={[styles.plus, { transform: [{ rotate: rotation }] }]}>
          +
        </Animated.Text>
      </Pressable>

      {/* Modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.title}>New Product</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Product name"
              placeholderTextColor={colors.icon}
            />

            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={String(quantity)}
              onChangeText={(t) => {
                const digits = t.replace(/[^0-9]/g, "");
                setQuantity(digits === "" ? 0 : parseInt(digits, 10));
              }}
              style={styles.input}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.icon}
            />

            <View style={styles.actions}>
              <Pressable
                style={styles.btn}
                onPress={() => {
                  reset();
                  close();
                }}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>

              <Pressable style={[styles.btn, styles.btnPrimary]} onPress={submit}>
                <Text style={[styles.btnText, styles.btnTextPrimary]}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
