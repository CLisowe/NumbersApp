import { useCallback, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";
import { createProductsBulk, NewProductInput } from "@/lib/products"; 

export type ImportResult = {
  totalRows: number;
  validRows: number;
  imported: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
};

function normalizeHeader(h: string) {
  return h.trim().toLowerCase();
}

function toNumberOrNull(v: any) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function mapRowToProduct(row: Record<string, any>): NewProductInput {
  const name = String(row.name ?? row["product"] ?? row["product name"] ?? "").trim();

  const qtyRaw = row.quantity ?? row.qty ?? row["count"] ?? row["amount"] ?? "";
  const qty = toNumberOrNull(qtyRaw);

  return {
    name,
    quantity: qty ?? 0,
    is_favorite: false,
  };
}

export function useImportProductsCsv() {
  const [isImporting, setIsImporting] = useState(false);

  const importProductsCsv = useCallback(async (): Promise<ImportResult> => {
    setIsImporting(true);

    const result: ImportResult = {
      totalRows: 0,
      validRows: 0,
      imported: 0,
      skipped: 0,
      errors: [],
    };

    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/vnd.ms-excel"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (picked.canceled) return result;

      const file = picked.assets?.[0];
      if (!file?.uri) {
        result.errors.push({ row: 0, message: "No file URI returned from picker." });
        return result;
      }

      const response = await fetch(file.uri);
      const csvText = await response.text()

      const parsed = Papa.parse<Record<string, any>>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => normalizeHeader(h),
      });

      if (parsed.errors?.length) {
        result.errors.push({ row: 0, message: parsed.errors[0].message });
        return result;
      }

      const rows = parsed.data ?? [];
      result.totalRows = rows.length;

      const valid: NewProductInput[] = [];

      rows.forEach((r, idx) => {
        const rowNumber = idx + 2;
        const p = mapRowToProduct(r);

        if (!p.name || p.name.trim().length === 0) {
          result.errors.push({ row: rowNumber, message: `Missing required field "name".` });
          result.skipped += 1;
          return;
        }

        if (!Number.isFinite(p.quantity) || p.quantity < 0) {
          result.errors.push({ row: rowNumber, message: `Invalid quantity (must be >= 0).` });
          result.skipped += 1;
          return;
        }

        valid.push({ name: p.name.trim(), quantity: Math.floor(p.quantity), is_favorite: false });
      });

      result.validRows = valid.length;

      if (valid.length === 0) return result;

      const ins = await createProductsBulk(valid);
      result.imported = ins.inserted;

      return result;
    } catch (e: any) {
      result.errors.push({ row: 0, message: e?.message ?? "Import failed." });
      return result;
    } finally {
      setIsImporting(false);
    }
  }, []);

  return { isImporting, importProductsCsv };
}
