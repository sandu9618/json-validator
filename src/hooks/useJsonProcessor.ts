"use client";

import { useCallback, useState } from "react";
import { formatJson, parseJson } from "@/lib/jsonUtils";
import type { IndentTemplate, ProcessState } from "@/types";

const initialState: ProcessState = {
  formatted: "",
  errors: [],
  isValid: false,
  status: "idle",
};

export function useJsonProcessor() {
  const [input, setInput] = useState("");
  const [template, setTemplate] = useState<IndentTemplate>("twospace");
  const [state, setState] = useState<ProcessState>(initialState);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const process = useCallback(() => {
    const result = parseJson(input);
    if (!result.ok) {
      setState({
        formatted: "",
        errors: result.errors,
        isValid: false,
        status: "invalid",
      });
      return;
    }
    setState({
      formatted: formatJson(result.value, template),
      errors: [],
      isValid: true,
      status: "valid",
    });
  }, [input, template]);

  const clear = useCallback(() => {
    setInput("");
    setState(initialState);
  }, []);

  const copy = useCallback(async () => {
    if (!state.isValid || !state.formatted) return;
    try {
      await navigator.clipboard.writeText(state.formatted);
      showToast("Copied to clipboard!");
    } catch {
      showToast("Copy failed — please select and copy manually.");
    }
  }, [state.formatted, state.isValid, showToast]);

  const download = useCallback(() => {
    if (!state.isValid || !state.formatted) return;
    const blob = new Blob([state.formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "formatted.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Download started!");
  }, [state.formatted, state.isValid, showToast]);

  return {
    input,
    setInput,
    template,
    setTemplate,
    state,
    process,
    clear,
    copy,
    download,
    toast,
  };
}
