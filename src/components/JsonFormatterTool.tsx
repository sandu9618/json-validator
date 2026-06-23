"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { INDENT_OPTIONS, SAMPLE_JSON } from "@/lib/constants";
import { useJsonProcessor } from "@/hooks/useJsonProcessor";
import {
  getLineRange,
  lineColumnToOffset,
  offsetToLineColumn,
} from "@/lib/jsonUtils";
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

function isErrorNavigable(error: JsonError): boolean {
  return (
    (error.line !== undefined && error.column !== undefined) ||
    error.offset !== undefined
  );
}

function scrollTextareaToLine(textarea: HTMLTextAreaElement, line: number): void {
  const style = getComputedStyle(textarea);
  const lineHeight = parseFloat(style.lineHeight) || 20;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const targetScroll =
    (line - 1) * lineHeight - textarea.clientHeight / 2 + lineHeight / 2;
  textarea.scrollTop = Math.max(0, targetScroll + paddingTop);
}

export function JsonFormatterTool() {
  const {
    input,
    setInput,
    loadedFilename,
    template,
    setTemplate,
    state,
    process,
    clear,
    loadSample,
    loadFromFile,
    copy,
    download,
    toast,
  } = useJsonProcessor();

  const isMac = useIsMac();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [errorHighlight, setErrorHighlight] = useState(false);

  const canExport = state.isValid && state.formatted.length > 0;

  const [visibleToast, setVisibleToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (toast) {
      setVisibleToast(toast);
      toastRafRef.current = requestAnimationFrame(() => {
        setToastVisible(true);
      });
      return () => {
        if (toastRafRef.current !== null) {
          cancelAnimationFrame(toastRafRef.current);
        }
      };
    }

    setToastVisible(false);
    const timer = setTimeout(() => setVisibleToast(null), 200);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      process();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      loadFromFile(file);
    }
    e.target.value = "";
  }

  function handleErrorClick(error: JsonError) {
    const textarea = inputRef.current;
    if (!textarea || !isErrorNavigable(error)) return;

    let line: number;
    let start: number;
    let end: number;

    if (error.line !== undefined && error.column !== undefined) {
      line = error.line;
      const lineRange = getLineRange(input, line);
      start = Math.min(lineColumnToOffset(input, line, error.column), lineRange.end);
      end = lineRange.end;
    } else if (error.offset !== undefined) {
      const position = offsetToLineColumn(input, error.offset);
      line = position.line;
      const lineRange = getLineRange(input, line);
      start = lineRange.start;
      end = lineRange.end;
    } else {
      return;
    }

    textarea.focus({ preventScroll: true });
    textarea.scrollIntoView({ block: "nearest", behavior: "smooth" });
    textarea.setSelectionRange(start, end);
    scrollTextareaToLine(textarea, line);

    setErrorHighlight(true);
    window.setTimeout(() => setErrorHighlight(false), 1500);
  }

  const btnClass =
    "min-h-[44px] rounded-lg px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <section aria-label="JSON formatter tool" className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-4 lg:gap-y-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:col-start-1 lg:row-start-1 lg:self-stretch lg:content-center">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <label htmlFor="json-input" className="text-sm font-semibold text-zinc-800">
              JSON Input
            </label>
            {loadedFilename && (
              <span className="text-xs text-zinc-500">Loaded: {loadedFilename}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="indent-template" className="text-sm font-medium text-zinc-600">
              Indent:
            </label>
            <select
              id="indent-template"
              value={template}
              onChange={(e) => setTemplate(e.target.value as typeof template)}
              className="min-h-[44px] rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900"
            >
              {INDENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          ref={inputRef}
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={SAMPLE_JSON}
          spellCheck={false}
          className={`min-h-[320px] resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none lg:col-start-1 lg:row-start-2${
            errorHighlight
              ? " ring-2 ring-red-400"
              : " focus:ring-2 focus:ring-blue-500/20"
          }`}
        />
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-2 lg:col-start-1 lg:row-start-3 lg:self-start">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={process}
            className={`${btnClass} bg-blue-600 font-semibold text-white hover:bg-blue-700 focus:ring-blue-500`}
          >
            Process
          </button>
          <button
            type="button"
            onClick={clear}
            className={`${btnClass} border border-zinc-300 bg-white font-medium text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400`}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`${btnClass} border border-zinc-300 bg-white font-medium text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400`}
          >
            Upload file
          </button>
          <button
            type="button"
            onClick={loadSample}
            className={`${btnClass} border border-zinc-300 bg-white font-medium text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400`}
          >
            Load sample
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 lg:col-start-1 lg:row-start-4">
          <span className="hidden text-xs text-zinc-500 sm:inline">
            {isMac ? "⌘ Enter" : "Ctrl+Enter"} to process
          </span>
          <span className="text-xs text-zinc-500 tabular-nums sm:ml-auto">
            {formatInputSize(input.length)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:col-start-2 lg:row-start-1 lg:self-stretch lg:content-center">
          <label htmlFor="json-output" className="text-sm font-semibold text-zinc-800">
            Formatted Output
          </label>
          {state.status === "valid" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Valid JSON
            </span>
          )}
        </div>
        <textarea
          id="json-output"
          readOnly
          value={state.formatted}
          placeholder="Formatted JSON will appear here after processing valid input."
          spellCheck={false}
          className="min-h-[320px] resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm lg:col-start-2 lg:row-start-2"
        />
        <div className="flex flex-wrap items-center gap-2 lg:col-start-2 lg:row-start-3 lg:self-start">
          <span
            title={!canExport ? "Process valid JSON first" : undefined}
            className="inline-flex"
          >
            <button
              type="button"
              onClick={copy}
              disabled={!canExport}
              className={`${btnClass} border border-zinc-300 bg-white font-medium text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-40`}
            >
              Copy
            </button>
          </span>
          <span
            title={!canExport ? "Process valid JSON first" : undefined}
            className="inline-flex"
          >
            <button
              type="button"
              onClick={download}
              disabled={!canExport}
              className={`${btnClass} border border-zinc-300 bg-white font-medium text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-40`}
            >
              Download
            </button>
          </span>
        </div>
        <div className="lg:col-start-2 lg:row-start-4">
          {!canExport && (
            <span className="text-xs text-zinc-500">Process valid JSON first</span>
          )}
        </div>
      </div>

      {state.status === "invalid" && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <h2 className="mb-2 text-sm font-semibold text-red-800">Validation Errors</h2>
          <ul className="space-y-2">
            {state.errors.map((error, i) => {
              const location = formatErrorLocation(error);
              const navigable = isErrorNavigable(error);

              return (
                <li key={i} className="text-sm text-red-700">
                  {navigable ? (
                    <button
                      type="button"
                      onClick={() => handleErrorClick(error)}
                      className="-mx-1 min-h-[44px] cursor-pointer rounded px-1 py-2 text-left underline-offset-2 hover:underline"
                    >
                      {location && (
                        <span className="font-medium">{location}</span>
                      )}
                      {location && " — "}
                      {error.message}
                    </button>
                  ) : (
                    <>
                      {location && (
                        <span className="font-medium">{location}</span>
                      )}
                      {location && " — "}
                      {error.message}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {visibleToast && (
        <div
          role="status"
          aria-live="assertive"
          className={`toast fixed bottom-6 left-1/2 z-50 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white shadow-lg${toastVisible ? " toast--visible" : ""}`}
        >
          {visibleToast}
        </div>
      )}
    </section>
  );
}
