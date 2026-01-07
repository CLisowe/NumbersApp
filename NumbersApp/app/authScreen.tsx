import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { useAppTheme } from "@/theme/theme";
import AuthCard from "@/components/AuthCard";

export default function AuthScreen() {
  const { colors, spacing } = useAppTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const DEV_EMAIL = process.env.EXPO_PUBLIC_DEV_EMAIL ?? "";
  const DEV_PASSWORD = process.env.EXPO_PUBLIC_DEV_PASSWORD ?? "";

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: colors.background },
        container: {
          flex: 1,
          padding: spacing.lg,
          justifyContent: "center",
          gap: spacing.lg,
        },
      }),
    [colors.background, spacing.lg]
  );

  const signUp = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (override?: { email: string; password: string }) => {
    setMsg(null);
    setLoading(true);
    try {
      const useEmail = override?.email ?? email.trim();
      const usePassword = override?.password ?? password;

      const { error } = await supabase.auth.signInWithPassword({
        email: useEmail,
        password: usePassword,
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const onDevQuickLogin = () => {
    if (!DEV_EMAIL || !DEV_PASSWORD) {
      setMsg("Dev credentials not configured in .env");
      return;
    }
    signIn({ email: DEV_EMAIL, password: DEV_PASSWORD });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <AuthCard
          title="Numbers"
          subtitle="Sign in to continue"
          email={email}
          password={password}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          loading={loading}
          msg={msg}
          onSignIn={() => signIn()}
          onSignUp={signUp}
          showDevQuickLogin={__DEV__}
          onDevQuickLogin={onDevQuickLogin}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
