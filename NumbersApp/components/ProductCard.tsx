import { useMemo, useState, useEffect } from "react";
import {View,Text,TextInput,Pressable,StyleSheet,ActivityIndicator,Alert,} from "react-native";
import { useAppTheme } from "@/theme/theme";

export type Product = {
  id: string;
  name: string;
  quantity: number;
  is_favorite: boolean;
};

type Props = {
  product: Product;
  onUpdate: (next: Product) => Promise<{ ok: true } | { ok: false; error: string }>;
  onDelete: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>;
};

export default function ProductCard({ product, onUpdate, onDelete }: Props) {
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(product.name);
  const [draftQuantity, setDraftQuantity] = useState(product.quantity);

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftName(product.name);
      setDraftQuantity(product.quantity);
      setErrorMsg(null);
    }
  }, [isEditing, product.name, product.quantity]);

  const qtyNumber = (() => {
    const n = draftQuantity;
    if (Number.isNaN(n)) return 0;
    return Math.max(0, n);
  })();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        startBtn:{
          paddingVertical: spacing.xs, 
          paddingRight: spacing.sm, 
        },
        startText: {
          fontSize: fontSize.lg, 
          fontWeight: "700",
        },
        topRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.md,
        },

        leftTitle: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          flex: 1,
        },

        name: {
          fontSize: fontSize.lg,
          fontWeight: "800",
          color: colors.text,
          flex: 1,
        },

        qtyWrap: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
        },

        qty: {
          fontSize: fontSize.xl,
          fontWeight: "900",
          color: colors.text,
          minWidth: 52,
          textAlign: "right",
        },

        iconBtn: {
          width: 36,
          height: 36,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        },

        iconText: {
          fontSize: fontSize.lg,
          fontWeight: "900",
          color: colors.text,
          lineHeight: fontSize.lg + 2,
        },

        starText: {
          fontSize: fontSize.lg,
          fontWeight: "900",
          lineHeight: fontSize.lg + 2,
        },

        label: {
          color: colors.icon,
          fontWeight: "700",
          marginTop: spacing.sm,
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
          fontSize: fontSize.md,
        },

        actions: {
          flexDirection: "row",
          gap: spacing.sm,
          marginTop: spacing.md,
        },

        btn: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          flexDirection: "row",
          gap: spacing.sm,
        },

        btnPrimary: {
          backgroundColor: colors.tint,
          borderColor: colors.tint,
        },

        btnDanger: {
          borderColor: colors.danger,
        },

        btnText: {
          color: colors.text,
          fontWeight: "800",
        },

        btnTextPrimary: {
          color: colors.background,
        },

        dangerText: {
          color: colors.danger,
          fontWeight: "800",
        },

        errorBox: {
          marginTop: spacing.sm,
          padding: spacing.sm,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
        },

        errorText: {
          color: colors.text,
          fontWeight: "700",
          opacity: 0.9,
        },
      }),
    [colors, spacing, radius, fontSize]
  );

  const startEdit = () => {
    setDraftName(product.name);
    setDraftQuantity(product.quantity);
    setIsEditing(true);
    setErrorMsg(null);
  };

  const cancelEdit = () => {
    setDraftName(product.name);
    setDraftQuantity(product.quantity);
    setIsEditing(false);
    setErrorMsg(null);
  };

  const saveEdit = async () => {
    const next: Product = {
      ...product,
      name: draftName.trim() || product.name,
      quantity: qtyNumber,
    };

    setBusy(true);
    setErrorMsg(null);

    const res = await onUpdate(next);

    setBusy(false);

    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }

    setIsEditing(false);
  };

  const toggleFavorite = async () => {
    if (busy || isEditing) return;

    setBusy(true);
    setErrorMsg(null);

    const next: Product = { ...product, is_favorite: !product.is_favorite };
    const res = await onUpdate(next);

    setBusy(false);

    if (!res.ok) {
      setErrorMsg(res.error);
    }
  };

  const changeQty = async (delta: number) => {
    if (busy || isEditing) return;

    const nextQty = Math.max(0, (product.quantity ?? 0) + delta);
    if (nextQty === product.quantity) return;

    setBusy(true);
    setErrorMsg(null);

    const res = await onUpdate({ ...product, quantity: nextQty });

    setBusy(false);

    if (!res.ok) {
      setErrorMsg(res.error);
    }
  };

  const confirmDelete = () => {
    if (busy) return;

    Alert.alert(
      "Delete product?",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => doDelete(),
        },
      ],
      { cancelable: true }
    );
  };

  const doDelete = async () => {
    setBusy(true);
    setErrorMsg(null);

    const res = await onDelete(product.id);

    setBusy(false);

    if (!res.ok) {
      setErrorMsg(res.error);
    }
  };

  const starOn = !!product.is_favorite;

  return (
    <View style={styles.card}>
      {!isEditing ? (
        <>
          <View style={styles.topRow}>
            <View style={styles.leftTitle}>

              <Pressable
                style={({pressed}) =>[
                  styles.startBtn, 
                  (busy||isEditing) && {opacity:0.5}, 
                  pressed&&{opacity:0.6},
                ]}
                onPress={toggleFavorite}
                disabled={busy||isEditing}
                accessibilityRole="button"
                accessibilityLabel={starOn ? "Unfavorite product" : "Favorite product"}
              >
                <Text style={[styles.starText, { color: starOn ? colors.tint : colors.icon }]}>
                  ★
                </Text>
              </Pressable>

              <Text style={styles.name} numberOfLines={1}>
                {product.name}
              </Text>
            </View>

            <View style={styles.qtyWrap}>
              <Pressable
                style={[styles.iconBtn, busy && { opacity: 0.6 }]}
                onPress={() => changeQty(-1)}
                disabled={busy || product.quantity <= 0}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <Text style={styles.iconText}>−</Text>
              </Pressable>

              <Text style={styles.qty}>{product.quantity}</Text>

              <Pressable
                style={[styles.iconBtn, busy && { opacity: 0.6 }]}
                onPress={() => changeQty(1)}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <Text style={styles.iconText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.btnPrimary, busy && { opacity: 0.6 }]}
              onPress={startEdit}
              disabled={busy}
            >
              {busy ? <ActivityIndicator /> : null}
              <Text style={[styles.btnText, styles.btnTextPrimary]}>Edit</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.btnDanger, busy && { opacity: 0.6 }]}
              onPress={confirmDelete}
              disabled={busy}
            >
              {busy ? <ActivityIndicator /> : null}
              <Text style={styles.dangerText}>Delete</Text>
            </Pressable>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}
        </>
      ) : (
        <>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.icon}
            autoCapitalize="words"
            editable={!busy}
          />

          <Text style={styles.label}>Quantity</Text>
          <TextInput
            value={String(draftQuantity)}
            onChangeText={(t) => {
              const digits = t.replace(/[^0-9]/g, "");
              setDraftQuantity(digits === "" ? 0 : parseInt(digits, 10));
            }}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.icon}
            editable={!busy}
          />

          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, busy && { opacity: 0.6 }]}
              onPress={cancelEdit}
              disabled={busy}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.btnPrimary, busy && { opacity: 0.6 }]}
              onPress={saveEdit}
              disabled={busy}
            >
              {busy ? <ActivityIndicator /> : null}
              <Text style={[styles.btnText, styles.btnTextPrimary]}>Save</Text>
            </Pressable>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}
