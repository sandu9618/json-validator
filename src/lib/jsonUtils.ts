import { MAX_JSON_FILE_BYTES } from "@/lib/constants";
import type { IndentTemplate, ParseResult } from "@/types";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function validateFileSize(
  bytes: number,
  maxBytes = MAX_JSON_FILE_BYTES
): string | null {
  if (bytes > maxBytes) {
    return `File is too large (${formatFileSize(bytes)}). Please choose a file under ${formatFileSize(maxBytes)}.`;
  }
  return null;
}

export function offsetToLineColumn(
  input: string,
  offset: number
): { line: number; column: number } {
  const before = input.slice(0, offset);
  const lines = before.split("\n");
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

function extractPosition(message: string): number | undefined {
  const positionMatch = message.match(/position\s+(\d+)/i);
  if (positionMatch) return parseInt(positionMatch[1], 10);

  const atMatch = message.match(/at\s+(?:line\s+)?(\d+)/i);
  if (atMatch) return undefined;

  return undefined;
}

export function parseJson(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      errors: [{ message: "Input is empty. Paste JSON to validate." }],
    };
  }

  try {
    const value = JSON.parse(trimmed);
    return { ok: true, value };
  } catch (err) {
    const message =
      err instanceof SyntaxError ? err.message : "Unknown JSON syntax error";
    const offset = extractPosition(message);
    const position =
      offset !== undefined ? offsetToLineColumn(input, offset) : undefined;

    return {
      ok: false,
      errors: [
        {
          message,
          offset,
          line: position?.line,
          column: position?.column,
        },
      ],
    };
  }
}

export function formatJson(value: unknown, template: IndentTemplate): string {
  if (template === "compact") {
    return JSON.stringify(value);
  }
  const space = template === "twospace" ? 2 : template === "fourspace" ? 4 : "\t";
  return JSON.stringify(value, null, space);
}

export function downloadJson(content: string, filename = "formatted.json"): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
