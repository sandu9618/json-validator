"use client";

import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { SAMPLE_JSON } from "@/lib/constants";
import { formatJson, parseJson, validateFileSize } from "@/lib/jsonUtils";
import type { IndentTemplate, ProcessState } from "@/types";

const initialState: ProcessState = {
  errors: [],
  isValid: false,
  status: "idle",
  parsedValue: null,
};

function applyParseResult(
  setState: Dispatch<SetStateAction<ProcessState>>,
  input: string
): void {
  const result = parseJson(input);
  if (!result.ok) {
    setState({
      errors: result.errors,
      isValid: false,
      status: "invalid",
      parsedValue: null,
    });
    return;
  }
  setState({
    errors: [],
    isValid: true,
    status: "valid",
    parsedValue: result.value,
  });
}

export function useJsonProcessor() {
  const [input, setInputState] = useState("");
  const [loadedFilename, setLoadedFilename] = useState<string | null>(null);
  const [template, setTemplate] = useState<IndentTemplate>("twospace");
  const [state, setState] = useState<ProcessState>(initialState);
  const [toast, setToast] = useState<string | null>(null);

  const setInput = useCallback((value: string) => {
    setInputState(value);
    setLoadedFilename(null);
  }, []);

  const formatted = useMemo(
    () =>
      state.isValid && state.parsedValue != null
        ? formatJson(state.parsedValue, template)
        : "",
    [state.isValid, state.parsedValue, template]
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const process = useCallback(() => {
    applyParseResult(setState, input);
  }, [input]);

  const clear = useCallback(() => {
    setInputState("");
    setLoadedFilename(null);
    setState(initialState);
  }, []);

  const loadSample = useCallback(() => {
    setInputState(SAMPLE_JSON);
    setLoadedFilename(null);
    setState(initialState);
  }, []);

  const loadFromFile = useCallback((file: File) => {
    const sizeError = validateFileSize(file.size);
    if (sizeError) {
      setState({
        errors: [{ message: sizeError }],
        isValid: false,
        status: "invalid",
        parsedValue: null,
      });
      setLoadedFilename(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      if (typeof content !== "string") {
        setState({
          errors: [{ message: "Could not read file. Please try again." }],
          isValid: false,
          status: "invalid",
          parsedValue: null,
        });
        setLoadedFilename(null);
        return;
      }

      if (!content.trim()) {
        setState({
          errors: [{ message: "File is empty. Choose a JSON file with content." }],
          isValid: false,
          status: "invalid",
          parsedValue: null,
        });
        setLoadedFilename(null);
        return;
      }

      setInputState(content);
      setLoadedFilename(file.name);
      applyParseResult(setState, content);
    };
    reader.onerror = () => {
      setState({
        errors: [{ message: "Could not read file. Please try again." }],
        isValid: false,
        status: "invalid",
        parsedValue: null,
      });
      setLoadedFilename(null);
    };
    reader.readAsText(file);
  }, []);

  const copy = useCallback(async () => {
    if (!state.isValid || !formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      showToast("Copied to clipboard!");
    } catch {
      showToast("Copy failed — please select and copy manually.");
    }
  }, [formatted, state.isValid, showToast]);

  const download = useCallback(() => {
    if (!state.isValid || !formatted) return;
    const blob = new Blob([formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "formatted.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Download started!");
  }, [formatted, state.isValid, showToast]);

  return {
    input,
    setInput,
    loadedFilename,
    template,
    setTemplate,
    state: { ...state, formatted },
    process,
    clear,
    loadSample,
    loadFromFile,
    copy,
    download,
    toast,
  };
}
