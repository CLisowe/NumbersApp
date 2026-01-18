import React from "react";
import { Alert, Pressable, Text, ActivityIndicator } from "react-native";
import { useImportProductsCsv } from "@/lib/importProductsFromCsv";

export function ImportProductsCsvButton() {
  const { isImporting, importProductsCsv } = useImportProductsCsv();

  const onPress = async () => {
    const res = await importProductsCsv();

    if (
      res.totalRows === 0 &&
      res.validRows === 0 &&
      res.imported === 0 &&
      res.errors.length === 0
    ) {
      return;
    }

    if (res.errors.length) {
      const preview = res.errors
        .slice(0, 3)
        .map(e => `Row ${e.row}: ${e.message}`)
        .join("\n");

      const more =
        res.errors.length > 3
          ? `\n… +${res.errors.length - 3} more`
          : "";

      Alert.alert(
        "Import finished (with issues)",
        `Total rows: ${res.totalRows}
        Valid rows: ${res.validRows}
        Imported: ${res.imported}
        Skipped: ${res.skipped}

${preview}${more}`
      );
      return;
    }

    Alert.alert(
      "Import complete",
      `Total rows: ${res.totalRows}
Imported: ${res.imported}`
    );
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isImporting}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: isImporting ? "#444" : "black",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      {isImporting && <ActivityIndicator />}
      <Text style={{ color: "white", fontWeight: "600" }}>
        {isImporting ? "Importing…" : "Import CSV"}
      </Text>
    </Pressable>
  );
}
