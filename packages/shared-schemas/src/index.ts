import { z } from "zod";

export const ComponentNameSchema = z.enum([
  "Button", "IconButton", "Input", "Textarea", "Select", "Tabs", "Card",
  "Badge", "Dialog", "Tooltip", "Toast", "Sidebar", "AssetCard", "PrototypeFrame",
]);

export const DesignBriefSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(80),
  summary: z.string().min(20).max(1200),
  audience: z.string().min(3),
  primaryTask: z.string().min(3),
  surface: z.enum(["campaign-page", "live-launch", "video-template", "creator-card"]),
  tone: z.array(z.string()).min(1).max(5),
  requiredContent: z.array(z.string()).min(1),
  constraints: z.array(z.string()).default([]),
  brandSystemId: z.string().default("signal-garden"),
});

export const ComponentContractSchema = z.object({
  name: ComponentNameSchema,
  purpose: z.string().min(10),
  variants: z.array(z.string()).min(1),
  requiredProps: z.array(z.string()),
  optionalProps: z.array(z.string()),
  tokens: z.array(z.string()).min(1),
  accessibility: z.array(z.string()).min(1),
  examples: z.array(z.string()).min(1),
  invalidUsage: z.array(z.string()).min(1),
  composition: z.array(z.string()).min(1),
});

export const DesignSystemManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  themes: z.array(z.enum(["light", "dark"])),
  tokenSource: z.string(),
  tokenCategories: z.array(z.string()),
  componentContracts: z.array(ComponentContractSchema),
  constraints: z.array(z.string()),
  accessibility: z.object({ target: z.string(), contrast: z.string(), motion: z.string() }),
});

export const PrototypeBlockSchema = z.object({
  id: z.string(),
  component: ComponentNameSchema,
  variant: z.string(),
  props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  content: z.array(z.string()).default([]),
  tokenRefs: z.array(z.string()).min(1),
});

export const PrototypePlanSchema = z.object({
  briefId: z.string(),
  strategy: z.string(),
  informationArchitecture: z.array(z.string()).min(2),
  interactionModel: z.array(z.string()).min(1),
  selectedComponents: z.array(ComponentNameSchema).min(3),
  rationale: z.array(z.string()).min(1),
});

export const PrototypeSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  viewport: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }),
  theme: z.enum(["light", "dark"]),
  layout: z.enum(["campaign", "launch", "template", "profile"]),
  blocks: z.array(PrototypeBlockSchema).min(3),
  interactions: z.array(z.object({ trigger: z.string(), action: z.string(), target: z.string() })),
  source: z.enum(["mock", "provider"]),
  revision: z.number().int().min(0).max(2),
});

export const AssetRequestSchema = z.object({
  id: z.string(),
  kind: z.enum(["thumbnail", "cover", "sticker", "decorative", "social-card", "live-promo"]),
  prompt: z.string().min(10),
  aspectRatio: z.enum(["1:1", "4:5", "9:16", "16:9"]),
  palette: z.array(z.string()).min(2),
  constraints: z.array(z.string()),
  variants: z.number().int().min(2).max(4),
  status: z.enum(["queued", "generating", "ready", "approved", "rejected"]),
  provider: z.string(),
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export const AgentCritiqueSchema = z.object({
  agent: z.enum(["visual-qa", "accessibility-validation"]),
  summary: z.string(),
  severity: z.enum(["pass", "note", "warning", "blocker"]),
  findings: z.array(z.object({ category: z.string(), message: z.string(), blockId: z.string().optional() })),
  revisionRequired: z.boolean(),
});

export const PreferenceLabelSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  briefId: z.string(),
  preferredVariant: z.enum(["A", "B", "tie"]),
  visualHierarchy: z.number().int().min(1).max(5),
  contrast: z.number().int().min(1).max(5),
  readability: z.number().int().min(1).max(5),
  brandConsistency: z.number().int().min(1).max(5),
  contentClarity: z.number().int().min(1).max(5),
  compositionQuality: z.number().int().min(1).max(5),
  feedback: z.string().max(1000),
  provenance: z.literal("human"),
});

export const EvaluationResultSchema = z.object({
  id: z.string(),
  measuredAt: z.string().datetime(),
  prototypeId: z.string(),
  schemaValid: z.boolean(),
  tokenCompliance: z.object({ passed: z.number().int(), total: z.number().int(), percentage: z.number().min(0).max(100) }),
  componentUsage: z.object({ valid: z.number().int(), invalid: z.number().int() }),
  accessibilityViolations: z.union([z.number().int().min(0), z.literal("Not measured")]),
  keyboardChecks: z.union([z.object({ passed: z.number().int(), total: z.number().int() }), z.literal("Not measured")]),
  responsiveChecks: z.union([z.object({ passed: z.number().int(), total: z.number().int() }), z.literal("Not measured")]),
  generationLatencyMs: z.number().nonnegative(),
  agentFailures: z.number().int().nonnegative(),
  agentRetries: z.number().int().nonnegative(),
  visualRegression: z.union([z.object({ passed: z.number().int(), total: z.number().int() }), z.literal("Not measured")]),
  humanPreferenceLabels: z.number().int().nonnegative(),
  assetDecisions: z.object({ accepted: z.number().int(), rejected: z.number().int() }),
});

export const AgentTraceSchema = z.object({
  id: z.string(),
  agent: z.string(),
  role: z.string(),
  status: z.enum(["queued", "running", "completed", "failed", "revised"]),
  startedAt: z.string(),
  latencyMs: z.number().nonnegative(),
  input: z.record(z.string(), z.unknown()),
  output: z.record(z.string(), z.unknown()),
  toolCalls: z.array(z.object({ tool: z.string(), arguments: z.record(z.string(), z.unknown()), result: z.string() })),
  validationFailures: z.array(z.string()),
  decision: z.string(),
  usage: z.object({ inputTokens: z.number().nullable(), outputTokens: z.number().nullable(), costUsd: z.number().nullable() }),
});

export type DesignBrief = z.infer<typeof DesignBriefSchema>;
export type DesignSystemManifest = z.infer<typeof DesignSystemManifestSchema>;
export type ComponentContract = z.infer<typeof ComponentContractSchema>;
export type PrototypePlan = z.infer<typeof PrototypePlanSchema>;
export type PrototypeSpec = z.infer<typeof PrototypeSpecSchema>;
export type AssetRequest = z.infer<typeof AssetRequestSchema>;
export type AgentCritique = z.infer<typeof AgentCritiqueSchema>;
export type PreferenceLabel = z.infer<typeof PreferenceLabelSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
export type AgentTrace = z.infer<typeof AgentTraceSchema>;
