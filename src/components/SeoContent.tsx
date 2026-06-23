export function SeoContent() {
  return (
    <section className="prose prose-zinc max-w-none">
      <h2>How to Format and Validate JSON Online</h2>
      <p>
        JSON (JavaScript Object Notation) is the standard data format for APIs,
        configuration files, and data exchange. When JSON arrives minified — without
        line breaks or indentation — it becomes difficult to read and debug. This
        free JSON formatter and validator helps developers beautify raw JSON and
        catch syntax errors instantly.
      </p>

      <h3>Three simple steps</h3>
      <ol>
        <li>
          <strong>Paste your JSON</strong> into the input panel on the left, or type
          it directly.
        </li>
        <li>
          <strong>Click Process</strong> to validate syntax and format the output.
          Invalid JSON shows detailed error messages with line and column numbers.
        </li>
        <li>
          <strong>Copy or download</strong> the beautified JSON from the output panel.
          Choose your preferred indent style: 2 spaces, 4 spaces, tab, or compact.
        </li>
      </ol>

      <h3>Why validate JSON?</h3>
      <p>
        A single missing comma, unquoted key, or trailing comma can break an entire
        API integration. Validating JSON before deployment saves hours of debugging.
        This tool uses the native JSON parser aligned with{" "}
        <a
          href="https://www.rfc-editor.org/rfc/rfc8259"
          rel="noopener noreferrer"
          target="_blank"
        >
          RFC 8259
        </a>
        , the current JSON specification.
      </p>

      <h3>Privacy first</h3>
      <p>
        All validation and formatting runs entirely in your browser. Your JSON data
        is never uploaded to any server — making this tool safe for sensitive API
        responses, configuration secrets, and production data.
      </p>
    </section>
  );
}
