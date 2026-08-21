import { EvaluationResultSchema, PrototypeSpecSchema, type EvaluationResult, type PrototypeSpec } from "../../shared-schemas/src";
import { componentContractMap } from "../../design-system/src/contracts";

const allowedTokenRoots=new Set(["color","typography","spacing","radius","shadow","motion","breakpoint","state","theme"]);

export interface EvaluationEvidence {
  accessibilityViolations?:number;
  keyboardChecks?:{passed:number;total:number};
  responsiveChecks?:{passed:number;total:number};
  visualRegression?:{passed:number;total:number};
  humanPreferenceLabels?:number;
  assetDecisions?:{accepted:number;rejected:number};
}

export function evaluatePrototype(raw:unknown,{latencyMs=0,agentFailures=0,agentRetries=0,evidence={}}:{latencyMs?:number;agentFailures?:number;agentRetries?:number;evidence?:EvaluationEvidence}={}):EvaluationResult {
  const parsed=PrototypeSpecSchema.safeParse(raw);
  const spec=parsed.success?parsed.data:raw as PrototypeSpec;
  const blocks=Array.isArray(spec?.blocks)?spec.blocks:[];
  const invalidComponents=blocks.filter((block)=>!componentContractMap[block.component]);
  const tokenRefs=blocks.flatMap((block)=>Array.isArray(block.tokenRefs)?block.tokenRefs:[]);
  const passedTokens=tokenRefs.filter((token)=>allowedTokenRoots.has(token.split(".")[0])).length;
  return EvaluationResultSchema.parse({
    id:`evaluation-${spec?.id??"invalid"}`,
    measuredAt:new Date().toISOString(),
    prototypeId:spec?.id??"invalid",
    schemaValid:parsed.success,
    tokenCompliance:{passed:passedTokens,total:tokenRefs.length,percentage:tokenRefs.length?Math.round((passedTokens/tokenRefs.length)*1000)/10:0},
    componentUsage:{valid:blocks.length-invalidComponents.length,invalid:invalidComponents.length},
    accessibilityViolations:evidence.accessibilityViolations??"Not measured",
    keyboardChecks:evidence.keyboardChecks??"Not measured",
    responsiveChecks:evidence.responsiveChecks??"Not measured",
    generationLatencyMs:latencyMs,
    agentFailures,
    agentRetries,
    visualRegression:evidence.visualRegression??"Not measured",
    humanPreferenceLabels:evidence.humanPreferenceLabels??0,
    assetDecisions:evidence.assetDecisions??{accepted:0,rejected:0},
  });
}

export function evaluationToMarkdown(result:EvaluationResult){
  const metric=(value:unknown)=>typeof value==="string"?value:JSON.stringify(value);
  return [`# CreatorKit AI evaluation report`,``,`Measured: ${result.measuredAt}`,`Prototype: ${result.prototypeId}`,``,`| Metric | Result |`,`| --- | --- |`,`| Schema valid | ${result.schemaValid?"Pass":"Fail"} |`,`| Design-token compliance | ${result.tokenCompliance.passed}/${result.tokenCompliance.total} (${result.tokenCompliance.percentage}%) |`,`| Component usage | ${result.componentUsage.valid} valid / ${result.componentUsage.invalid} invalid |`,`| Accessibility violations | ${metric(result.accessibilityViolations)} |`,`| Keyboard checks | ${metric(result.keyboardChecks)} |`,`| Responsive checks | ${metric(result.responsiveChecks)} |`,`| Generation latency | ${result.generationLatencyMs} ms |`,`| Agent failures / retries | ${result.agentFailures} / ${result.agentRetries} |`,`| Visual regression | ${metric(result.visualRegression)} |`,`| Human preference labels | ${result.humanPreferenceLabels} |`,`| Asset accepted / rejected | ${result.assetDecisions.accepted} / ${result.assetDecisions.rejected} |`,``,`Business conversion and revenue are hypothetical downstream metrics and are not measured in this local project.`,``].join("\n");
}
