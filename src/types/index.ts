export type IndentTemplate = "twospace" | "fourspace" | "onetab" | "compact";

export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  offset?: number;
}

export interface ParseSuccess {
  ok: true;
  value: unknown;
}

export interface ParseFailure {
  ok: false;
  errors: JsonError[];
}

export type ParseResult = ParseSuccess | ParseFailure;

export type ValidationStatus = "idle" | "valid" | "invalid";

export interface ProcessState {
  formatted: string;
  errors: JsonError[];
  isValid: boolean;
  status: ValidationStatus;
}
