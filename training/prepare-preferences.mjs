import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";

const [inputPath, outputPath = "training/preference-ranking.jsonl"] = process.argv.slice(2);
if (!inputPath) {
  console.error("Usage: node training/prepare-preferences.mjs <human-labels.jsonl> [output.jsonl]");
  process.exit(1);
}

const reader = createInterface({ input: createReadStream(inputPath), crlfDelay: Infinity });
const writer = createWriteStream(outputPath, { encoding: "utf8" });
let written = 0;
let skipped = 0;

for await (const line of reader) {
  if (!line.trim()) continue;
  const label = JSON.parse(line);
  const valid = label.provenance === "human" && ["A", "B", "tie"].includes(label.preferredVariant) && typeof label.briefId === "string";
  if (!valid || label.preferredVariant === "tie") { skipped += 1; continue; }
  const chosen = label.preferredVariant;
  const rejected = chosen === "A" ? "B" : "A";
  writer.write(`${JSON.stringify({
    id: label.id,
    promptId: label.briefId,
    chosenVariant: chosen,
    rejectedVariant: rejected,
    scores: {
      visualHierarchy: label.visualHierarchy,
      contrast: label.contrast,
      readability: label.readability,
      brandConsistency: label.brandConsistency,
      contentClarity: label.contentClarity,
      compositionQuality: label.compositionQuality,
    },
    rationale: label.feedback ?? "",
    provenance: "human",
  })}\n`);
  written += 1;
}

writer.end();
await new Promise((resolve, reject) => { writer.on("finish", resolve); writer.on("error", reject); });
console.log(JSON.stringify({ written, skipped, outputPath }));
