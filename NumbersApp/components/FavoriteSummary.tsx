import React, {useMemo} from "react"; 
import {View, Text, StyleSheet} from "react-native";
import { useAppTheme } from "@/theme/theme";

type Props = {
    name: string;
    quantity: number;
};

export default function FavoriteSummaryRow({name, quantity}: Props){
    const{colors, spacing, radius, fontSize} = useAppTheme(); 

    const styles = useMemo(
        () =>
            StyleSheet.create({
            row: {
            flexDirection: "row",
            alignItems: "center",
             justifyContent: "space-between",
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
        },
        name: {
          flex: 1,
          color: colors.text,
          fontSize: fontSize.md,
          fontWeight: "800",
        },
        qty: {
          color: colors.text,
          fontSize: fontSize.lg,
          fontWeight: "900",
          marginLeft: spacing.md,
        },
            }),
            [colors, spacing, radius, fontSize]
    );

    return(
        <View style={styles.row}>
            <Text style = {styles.name} numberOfLines={1}>
                {name}
            </Text>
            <Text style={styles.qty}>{quantity}</Text>
        </View>
    )
}