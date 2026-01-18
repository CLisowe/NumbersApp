import React, {useMemo} from "react";
import {View, TextInput, Pressable, StyleSheet} from "react-native";
import { useAppTheme } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?:string;
    onClear?: () => void;
    autoFocus?: boolean;
};

export default function SearchBar({
    value, 
    onChangeText, 
    placeholder = "Search products...", 
    onClear, 
    autoFocus, 
}: Props){
    const{colors, spacing, radius, fontSize} = useAppTheme();

    const styles = useMemo(
        () => 
            StyleSheet.create({
                wrap: {
                    flexDirection: "row", 
                    alignItems: "center", 
                    gap: spacing.md, 
                    paddingHorizontal: spacing.md, 
                    paddingVertical: spacing.sm, 
                    borderRadius: radius.lg,
                    borderWidth: 1, 
                    borderColor: colors.border, 
                    backgroundColor: colors.card, 
                },
                input: {
                    flex: 1, 
                    fontSize: fontSize.md, 
                    color: colors.text, 
                    paddingVertical: 0, 
                },
                iconBtn: {
                    padding: spacing.xs, 
                    borderRadius: radius.md,
                },
            }),
            [colors, spacing, radius, fontSize]
    );

    const showClear = value.trim().length > 0;

    return (
        <View style={styles.wrap}>
            <Ionicons name="search" size={10} color={colors.icon} />
            <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.icon} 
            autoCorrect = {false}
            autoCapitalize="none"
            autoFocus = {autoFocus} 
            style= {styles.input} 
            returnKeyType="search"
            />
            {showClear?(
                   <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
          hitSlop={10}
        >
          <Ionicons name="close-circle" size={18} color={colors.icon} />
        </Pressable>
            ):null}
        </View>
    )
}