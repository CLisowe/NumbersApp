import { useMemo, useState, useEffect } from "react";
import {View, Text, TextInput, Pressable, StyleSheet} from "react-native";
import { FontSize, Radius, Spacing, useAppTheme, Colors } from "@/theme/theme";

export type Product = {
    id: string; 
    name: string; 
    quantity: number; 
};

type Props = {
    product: Product;
    onUpdate: (next: Product) => void;
    onDelete: (id: string) => void;
};

export default function ProductCard({product, onUpdate, onDelete}: Props){
    const {colors, spacing, radius, fontSize} = useAppTheme();

    const[isEditing, setIsEditing] = useState(false);
    const[draftName, setDraftName] = useState(product.name);
    const[draftQuantity, setDraftQuantity] = useState(product.quantity);

    useEffect(()=>{
        if(!isEditing) {
            setDraftName(product.name);
            setDraftQuantity(product.quantity);
        }
    }, [isEditing, product.name, product.quantity]);
    
    const qtyNumber = (()=> {
        const n = draftQuantity;
        if(Number.isNaN(n)) return 0; 
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
        row: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.md,
        },
        name: {
          fontSize: fontSize.lg,
          fontWeight: "800",
          color: colors.text,
          flex: 1,
        },
        qty: {
          fontSize: fontSize.xl,
          fontWeight: "900",
          color: colors.text,
          marginLeft: spacing.md,
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
      }),
    [colors, spacing, radius, fontSize]
  );

  const startEdit = () => {
    setDraftName(product.name); 
    setDraftQuantity(product.quantity);
    setIsEditing(true); 
    console.log("startEdit");
  };

  const cancelEdit = () => {
    setDraftName(product.name); 
    setDraftQuantity(product.quantity); 
    setIsEditing(false);
    console.log("cancelEdit");
  };

  const saveEdit = () => {
    onUpdate({
        ...product, 
        name: draftName.trim() || product.name,
        quantity: qtyNumber, 
    });
    setIsEditing(false);
    console.log("saveEdit");
  };

   return (
    <View style={styles.card}>
      {!isEditing ? (
        <>
          <View style={styles.row}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.qty}>{product.quantity}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={startEdit}>
              <Text style={[styles.btnText, styles.btnTextPrimary]}>Edit</Text>
            </Pressable>

            {onDelete && (
              <Pressable style={[styles.btn, styles.btnDanger]} onPress={() => onDelete(product.id)}>
                <Text style={styles.dangerText}>Delete</Text>
              </Pressable>
            )}
          </View>
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
          />

          <Text style={styles.label}>Quantity</Text>
          <TextInput
            value={String(draftQuantity)}
            onChangeText={(t) => {
                const digits = t.replace(/[^0-9]/g,"");
                setDraftQuantity(digits === "" ? 0 : parseInt(digits, 10));
            }}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.icon}
          />

          <View style={styles.actions}>
            <Pressable style={styles.btn} onPress={cancelEdit}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={saveEdit}>
              <Text style={[styles.btnText, styles.btnTextPrimary]}>Save</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}