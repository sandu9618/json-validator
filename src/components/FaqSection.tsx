const FAQ_ITEMS = [
  {
    question: "How do I format JSON?",
    answer:
      "Paste your JSON into the input area and click Process. Valid JSON is automatically beautified with your chosen indentation in the output panel. You can then copy or download the result.",
  },
  {
    question: "How do I fix invalid JSON?",
    answer:
      "When JSON is invalid, the Validator Output panel shows the error message along with the line and column where parsing failed. Common fixes include adding missing quotes around keys, removing trailing commas, and replacing single quotes with double quotes.",
  },
  {
    question: "Is my JSON data sent to a server?",
    answer:
      "No. All processing happens locally in your browser. Your data never leaves your device.",
  },
  {
    question: "What JSON standard does this tool use?",
    answer:
      "This tool validates JSON using the native JavaScript JSON parser, which conforms to RFC 8259 — the current JSON data interchange standard.",
  },
  {
    question: "Can I minify JSON?",
    answer:
      'Yes. Select "Compact" from the indent dropdown before clicking Process to remove all whitespace and produce minified JSON.',
  },
];

export function FaqSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="mb-6 text-2xl font-bold text-zinc-900">
        Frequently Asked Questions
      </h2>
      <dl className="space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <dt className="text-lg font-semibold text-zinc-800">
              {item.question}
            </dt>
            <dd className="mt-2 text-zinc-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
