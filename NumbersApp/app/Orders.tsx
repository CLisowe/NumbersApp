import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/theme";

export default function OrdersScreen() {
 const { colors, spacing, radius, fontSize } = useAppTheme();
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text, fontSize: fontSize.xl}]}>Orders</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: "center",
        justifyContent: "center", 
    },
    title:{
    fontWeight:"800",
    },
});
