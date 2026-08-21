# Optional preference-training preparation

CreatorKit exports only explicit human labels from the Evaluation Lab. Prepare them for pairwise ranking with:

```bash
node training/prepare-preferences.mjs path/to/creator-kit-human-preferences.jsonl
```

The script rejects synthetic provenance and skips ties, then emits chosen/rejected variant IDs, six aesthetic scores, and the human rationale. Join those IDs to exported artifact packages before model training.

This repository does **not** claim a LoRA run. A later LoRA experiment would require licensed image files, a compatible base model, held-out evaluation data, suitable compute, and a documented comparison against the unmodified model. Until those conditions exist, training quality and preference lift are **Not measured**.
