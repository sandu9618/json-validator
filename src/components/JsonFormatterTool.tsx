"use client";

import { useSyncExternalStore } from "react";
import { INDENT_OPTIONS, SAMPLE_JSON } from "@/lib/constants";
import { useJsonProcessor } from "@/hooks/useJsonProcessor";
import type { JsonError } from "@/types";

const MAC_RE = /Mac|iPhone|iPad|iPod/;

function useIsMac(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => MAC_RE.test(navigator.userAgent),
    () => false
  );
}

function formatInputSize(chars: number): string {
  if (chars < 1024) return `${chars} chars`;
  const kb = chars / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatErrorLocation(error: JsonError): string {
  if (error.line !== undefined && error.column !== undefined) {
    return `Line ${error.line}, column ${error.column}`;
  }
  if (error.offset !== undefined) {
    return `Position ${error.offset}`;
  }
  return "";
}

export function JsonFormatterTool() {
  const {
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
  } = useJsonProcessor();

  const isMac = useIsMac();

  const canExport = state.isValid && state.formatted.length > 0;

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      process();
    }
  }

  return (
    <section aria-label="JSON formatter tool" className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="indent-template" className="text-sm font-medium text-zinc-600">
          Indent:
        </label>
        <select
          id="indent-template"
          value={template}
          onChange={(e) => setTemplate(e.target.value as typeof template)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900"
        >
          {INDENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="json-input" className="text-sm font-semibold text-zinc-800">
            JSON Input
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={SAMPLE_JSON}
            spellCheck={false}
            className="min-h-[320px] resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={process}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Process
              </button>
              <button
                type="button"
                onClick={clear}
                className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Clear
              </button>
              <span className="hidden text-xs text-zinc-500 sm:inline">
                {isMac ? "⌘ Enter" : "Ctrl+Enter"} to process
              </span>
            </div>
            <span className="text-xs text-zinc-500 tabular-nums">
              {formatInputSize(input.length)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="json-output" className="text-sm font-semibold text-zinc-800">
            Formatted Output
          </label>
          <textarea
            id="json-output"
            readOnly
            value={state.formatted}
            placeholder="Formatted JSON will appear here after processing valid input."
            spellCheck={false}
            className="min-h-[320px] resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              disabled={!canExport}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={download}
              disabled={!canExport}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      <div
        role={state.status === "invalid" ? "alert" : "status"}
        aria-live="polite"
        className={`rounded-lg border p-4 ${
          state.status === "invalid"
            ? "border-red-200 bg-red-50"
            : state.status === "valid"
              ? "border-green-200 bg-green-50"
              : "border-zinc-200 bg-white"
        }`}
      >
        <h2
          className={`mb-2 text-sm font-semibold ${
            state.status === "invalid"
              ? "text-red-800"
              : state.status === "valid"
                ? "text-green-800"
                : "text-zinc-800"
          }`}
        >
          Validator Output
        </h2>
        {state.status === "idle" && (
          <p className="text-sm text-zinc-600">
            Paste JSON above and click Process to validate syntax.
          </p>
        )}
        {state.status === "valid" && (
          <p className="text-sm text-green-700">
            Valid JSON — no syntax errors found.
          </p>
        )}
        {state.status === "invalid" && (
          <ul className="space-y-2">
            {state.errors.map((error, i) => (
              <li key={i} className="text-sm text-red-700">
                <span className="font-medium">{formatErrorLocation(error)}</span>
                {formatErrorLocation(error) && " — "}
                {error.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </section>
  );
}
