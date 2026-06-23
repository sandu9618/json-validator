"use client";

import { useCallback, useMemo, useState } from "react";
import { SAMPLE_JSON } from "@/lib/constants";
import { formatJson, parseJson } from "@/lib/jsonUtils";
import type { IndentTemplate, ProcessState } from "@/types";

const initialState: ProcessState = {
  errors: [],
  isValid: false,
  status: "idle",
  parsedValue: null,
};

export function useJsonProcessor() {
  const [input, setInput] = useState("");
  const [template, setTemplate] = useState<IndentTemplate>("twospace");
  const [state, setState] = useState<ProcessState>(initialState);
  const [toast, setToast] = useState<string | null>(null);

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
  }, [input]);

  const clear = useCallback(() => {
    setInput("");
    setState(initialState);
  }, []);

  const loadSample = useCallback(() => {
    setInput(SAMPLE_JSON);
    setState(initialState);
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
    template,
    setTemplate,
    state: { ...state, formatted },
    process,
    clear,
    loadSample,
    copy,
    download,
    toast,
  };
}
