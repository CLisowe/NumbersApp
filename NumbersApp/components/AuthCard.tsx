import React, { useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "@/theme/theme";

type Props = {
  title?: string;
  subtitle?: string;

  email: string;
  password: string;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;

  loading?: boolean;
  msg?: string | null;

  onSignIn: () => void;
  onSignUp: () => void;

  showDevQuickLogin?: boolean;
  onDevQuickLogin?: () => void;
};

export default function AuthCard({
  title = "Numbers",
  subtitle = "Sign in to continue",

  email,
  password,
  onChangeEmail,
  onChangePassword,

  loading = false,
  msg = null,

  onSignIn,
  onSignUp,

  showDevQuickLogin = false,
  onDevQuickLogin,
}: Props) {
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: { gap: spacing.xs },
        title: {
          fontSize: fontSize.xl,
          fontWeight: "900",
          color: colors.text,
        },
        subtitle: {
          fontSize: fontSize.lg,
          fontWeight: "600",
          color: colors.icon,
        },
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.lg,
          gap: spacing.md,
        },
        label: {
          fontSize: fontSize.sm,
          fontWeight: "700",
          color: colors.icon,
          marginBottom: spacing.xs,
        },
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          color: colors.text,
          fontSize: fontSize.lg,
        },
        msg: {
          color: colors.text,
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.sm,
          borderRadius: radius.md,
        },

        button: {
          height: 48,
          borderRadius: radius.md,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.tint,
        },
        buttonText: {
          fontWeight: "900",
          color: colors.background,
          fontSize: fontSize.lg,
        },

        secondaryButton: {
          height: 48,
          borderRadius: radius.md,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        secondaryText: {
          fontWeight: "900",
          color: colors.text,
          fontSize: fontSize.lg,
        },

        devButton: {
          height: 44,
          borderRadius: radius.md,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        devText: {
          fontWeight: "800",
          color: colors.icon,
          fontSize: fontSize.sm,
        },

        disabled: { opacity: 0.55 },
      }),
    [colors, spacing, radius, fontSize]
  );

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.card}>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@email.com"
            placeholderTextColor={colors.icon}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={onChangeEmail}
            style={styles.input}
            editable={!loading}
          />
        </View>

        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor={colors.icon}
            secureTextEntry
            value={password}
            onChangeText={onChangePassword}
            style={styles.input}
            editable={!loading}
          />
        </View>

        <Pressable
          style={[styles.button, loading && styles.disabled]}
          onPress={onSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing in…" : "Sign In"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, loading && styles.disabled]}
          onPress={onSignUp}
          disabled={loading}
        >
          <Text style={styles.secondaryText}>
            {loading ? "Please wait…" : "Sign Up"}
          </Text>
        </Pressable>

        {showDevQuickLogin && (
          <Pressable
            style={[styles.devButton, loading && styles.disabled]}
            onPress={onDevQuickLogin}
            disabled={loading}
          >
            <Text style={styles.devText}>Dev Quick Login</Text>
          </Pressable>
        )}

        {msg ? <Text style={styles.msg}>{msg}</Text> : null}
      </View>
    </>
  );
}
