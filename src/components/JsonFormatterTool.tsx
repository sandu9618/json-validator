"use client";

import { useRef, useState, useSyncExternalStore } from "react";
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

function IconPlay() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
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

  const inputPanelClass = [
    "code-panel",
    errorHighlight ? "code-panel--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const outputPanelClass = [
    "code-panel",
    state.status === "valid" ? "code-panel--valid" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section aria-label="JSON formatter tool">
      <div className="tool-card p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-[1fr_auto] lg:items-stretch lg:gap-x-4 lg:gap-y-3">
          {/* Input panel */}
          <div className={`${inputPanelClass} lg:col-start-1 lg:row-start-1`}>
            <div className="code-panel__header">
              <div className="code-panel__title">
                <span className="code-panel__dot bg-blue-400" aria-hidden="true" />
                <label htmlFor="json-input">JSON Input</label>
                {loadedFilename && (
                  <span className="ml-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-normal text-blue-600">
                    {loadedFilename}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="indent-template" className="text-xs font-medium text-slate-500">
                  Indent
                </label>
                <select
                  id="indent-template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as typeof template)}
                  className="min-h-[36px] rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
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
              className="code-panel__body font-mono"
            />
            <div className="code-panel__footer">
              <span className="hidden sm:inline">
                {isMac ? "⌘ Enter" : "Ctrl+Enter"} to process
              </span>
              <span className="tabular-nums sm:ml-auto">{formatInputSize(input.length)}</span>
            </div>
          </div>

          {/* Flow arrow — desktop only, centered between panels */}
          <div
            className="hidden lg:col-start-2 lg:row-start-1 lg:flex lg:items-center lg:justify-center lg:self-center"
            aria-hidden="true"
          >
            <IconArrow />
          </div>

          {/* Output panel */}
          <div className={`${outputPanelClass} lg:col-start-3 lg:row-start-1`}>
            <div className="code-panel__header">
              <div className="code-panel__title">
                <span
                  className={`code-panel__dot ${state.status === "valid" ? "bg-emerald-400" : "bg-slate-300"}`}
                  aria-hidden="true"
                />
                <label htmlFor="json-output">Formatted Output</label>
              </div>
              <div className="flex min-h-[36px] items-center">
                {state.status === "valid" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Valid
                  </span>
                ) : (
                  <span className="invisible text-xs" aria-hidden="true">
                    Valid
                  </span>
                )}
              </div>
            </div>
            <textarea
              id="json-output"
              readOnly
              value={state.formatted}
              placeholder="Formatted JSON will appear here after processing valid input."
              spellCheck={false}
              className="code-panel__body code-panel__body--readonly font-mono"
            />
            <div className="code-panel__footer">
              {!canExport ? (
                <span>Process valid JSON to enable export</span>
              ) : (
                <span className="text-emerald-600">Ready to copy or download</span>
              )}
            </div>
          </div>

          {/* Input buttons */}
          <div className="tool-actions lg:col-start-1 lg:row-start-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            />
            <button type="button" onClick={process} className="btn btn-primary">
              <IconPlay />
              Process
            </button>
            <button type="button" onClick={clear} className="btn btn-secondary">
              <IconTrash />
              Clear
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
            >
              <IconUpload />
              Upload
            </button>
            <button type="button" onClick={loadSample} className="btn btn-secondary">
              <IconDocument />
              Sample
            </button>
          </div>

          {/* Spacer under arrow column */}
          <div className="hidden lg:col-start-2 lg:row-start-2 lg:block" aria-hidden="true" />

          {/* Output buttons */}
          <div className="tool-actions lg:col-start-3 lg:row-start-2">
            <span
              title={!canExport ? "Process valid JSON first" : undefined}
              className="inline-flex"
            >
              <button
                type="button"
                onClick={copy}
                disabled={!canExport}
                className="btn btn-secondary"
              >
                <IconCopy />
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
                className="btn btn-secondary"
              >
                <IconDownload />
                Download
              </button>
            </span>
          </div>
        </div>

        {state.status === "invalid" && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-5 rounded-xl border border-red-200/80 bg-gradient-to-br from-red-50 to-rose-50 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <h2 className="text-sm font-semibold text-red-800">
                Validation Errors
                <span className="ml-2 font-normal text-red-600">
                  — click an error to jump to it
                </span>
              </h2>
            </div>
            <ul className="space-y-1">
              {state.errors.map((error, i) => {
                const location = formatErrorLocation(error);
                const navigable = isErrorNavigable(error);

                return (
                  <li key={i} className="text-sm text-red-700">
                    {navigable ? (
                      <button
                        type="button"
                        onClick={() => handleErrorClick(error)}
                        className="-mx-2 min-h-[44px] w-full cursor-pointer rounded-lg px-2 py-2 text-left transition-colors hover:bg-red-100/60"
                      >
                        {location && (
                          <span className="font-mono text-xs font-semibold text-red-800">
                            {location}
                          </span>
                        )}
                        {location && (
                          <span className="mx-2 text-red-300" aria-hidden="true">
                            ·
                          </span>
                        )}
                        <span>{error.message}</span>
                      </button>
                    ) : (
                      <div className="px-2 py-2">
                        {location && (
                          <span className="font-mono text-xs font-semibold text-red-800">
                            {location}
                          </span>
                        )}
                        {location && (
                          <span className="mx-2 text-red-300" aria-hidden="true">
                            ·
                          </span>
                        )}
                        <span>{error.message}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="assertive"
          className="toast fixed bottom-6 left-1/2 z-50 flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800 px-5 py-2.5 text-sm font-medium text-white shadow-2xl shadow-slate-900/25"
        >
          <svg aria-hidden="true" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}
    </section>
  );
}
