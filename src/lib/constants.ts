import type { IndentTemplate } from "@/types";

export const SAMPLE_JSON = `{
  "name": "example",
  "version": "1.0.0",
  "features": ["validate", "format"]
}`;

export const INDENT_OPTIONS: { value: IndentTemplate; label: string }[] = [
  { value: "twospace", label: "2 spaces" },
  { value: "fourspace", label: "4 spaces" },
  { value: "onetab", label: "Tab" },
  { value: "compact", label: "Compact" },
];

export const SITE_NAME = "JSON Formatter & Validator";

export const SITE_DESCRIPTION =
  "Free online JSON formatter and validator. Beautify, format, and validate JSON instantly in your browser. Your data never leaves your device.";
