import {
  AgentCritiqueSchema, AgentTraceSchema, AssetRequestSchema, DesignBriefSchema,
  PrototypePlanSchema, PrototypeSpecSchema,
  type AgentCritique, type AgentTrace, type AssetRequest, type DesignBrief,
  type PrototypePlan, type PrototypeSpec,
} from "../../shared-schemas/src";
import { componentContractMap } from "../../design-system/src/contracts";
import { sampleBriefs } from "./sample-briefs";

export { sampleBriefs };
export type AgentName="brief-analyst"|"system-librarian"|"prototype-composer"|"asset-art-director"|"visual-qa"|"accessibility-validation"|"orchestrator";
export interface WorkflowResult { brief:DesignBrief;plan:PrototypePlan;prototype:PrototypeSpec;assets:AssetRequest[];critiques:AgentCritique[];traces:AgentTrace[];revisionLoops:number;startedAt:string;completedAt:string;totalLatencyMs:number;provider:"mock"|"openai"; }

const roles:Record<AgentName,string>={
  "brief-analyst":"Turn the brief into audience, task, content, interaction, and business requirements.",
  "system-librarian":"Retrieve only permitted components, tokens, patterns, and constraints.",
  "prototype-composer":"Produce a schema-valid deterministic PrototypeSpec from approved parts.",
  "asset-art-director":"Translate the brand and brief into structured asset requests.",
  "visual-qa":"Critique hierarchy, spacing, contrast, consistency, brand fit, and clarity.",
  "accessibility-validation":"Interpret schema, component, contrast, keyboard, and motion checks.",
  "orchestrator":"Coordinate state, failures, and at most two critique-and-revision loops.",
};

const sleep=(ms:number)=>new Promise((resolve)=>setTimeout(resolve,ms));
const trace=(agent:AgentName,input:Record<string,unknown>,output:Record<string,unknown>,toolCalls:AgentTrace["toolCalls"],latencyMs:number,decision:string,status:AgentTrace["status"]="completed",validationFailures:string[]=[]):AgentTrace=>AgentTraceSchema.parse({id:`trace-${agent}-${status}`,agent,role:roles[agent],status,startedAt:new Date(0).toISOString(),latencyMs,input,output,toolCalls,validationFailures,decision,usage:{inputTokens:null,outputTokens:null,costUsd:null}});

const surfaceConfig={
  "campaign-page":{layout:"campaign" as const,headline:"MAKE IT / IN PUBLIC",subhead:"Seven days. Seven prompts. One body of work you can point to.",cta:"Join the challenge",tag:"OPEN CALL · 7 DAYS"},
  "live-launch":{layout:"launch" as const,headline:"MAKE SOMETHING LOUD.",subhead:"Three makers. One live hour. Every decision left on the canvas.",cta:"Set reminder",tag:"LIVE · FRIDAY 18:00"},
  "video-template":{layout:"template" as const,headline:"HOOK / PROOF / PAYOFF",subhead:"A three-beat structure for a story people can follow in fifteen seconds.",cta:"Use this template",tag:"15 SEC · 3 BEATS"},
  "creator-card":{layout:"profile" as const,headline:"MAYA MAKES WORLDS.",subhead:"Set designer, prop stylist, and practical-effects builder available for autumn collaborations.",cta:"Invite to campaign",tag:"AVAILABLE · OCT–NOV"},
};

function analyze(brief:DesignBrief){return {audience:brief.audience,task:brief.primaryTask,content:brief.requiredContent,interaction:[brief.primaryTask,"Inspect supporting detail","Return without losing state"],business:["Drive qualified intent","Preserve creator trust"],constraints:brief.constraints};}
function planFor(brief:DesignBrief):PrototypePlan { return PrototypePlanSchema.parse({briefId:brief.id,strategy:`Lead with ${brief.primaryTask.toLowerCase()}, then reveal proof and supporting detail.`,informationArchitecture:["Expressive hero","Primary action","Evidence strip","Supporting content"],interactionModel:["One dominant action","Progressive disclosure","Persistent return path"],selectedComponents:["PrototypeFrame","Badge","Card","Button","Tabs","AssetCard"],rationale:["The brief needs expressive hierarchy without sacrificing clear task completion.","Whitelisted components make rendering deterministic and auditable."]}); }
function compose(brief:DesignBrief,revision=0):PrototypeSpec { const config=surfaceConfig[brief.surface]; return PrototypeSpecSchema.parse({id:`spec-${brief.id}`,name:`${brief.title} / Variant A`,viewport:{width:375,height:690},theme:"dark",layout:config.layout,source:"mock",revision,blocks:[
  {id:"status",component:"Badge",variant:"accent",props:{text:config.tag},content:[config.tag],tokenRefs:["color.coral","radius.pill"]},
  {id:"hero",component:"Card",variant:"ink",props:{headline:config.headline,subhead:config.subhead},content:[config.headline,config.subhead],tokenRefs:["color.ink","color.lime","typography.size.2xl","spacing.8"]},
  {id:"primary",component:"Button",variant:"primary",props:{label:config.cta},content:[config.cta],tokenRefs:["color.lime","color.ink","radius.sm"]},
  {id:"proof",component:"Tabs",variant:"pill",props:{labels:"Overview,Lineup,Details"},content:["Overview","Lineup","Details"],tokenRefs:["color.canvas","spacing.2","radius.pill"]},
  {id:"support",component:"Card",variant:"surface",props:{title:brief.requiredContent[0],body:brief.requiredContent.slice(1).join(" · ")},content:brief.requiredContent,tokenRefs:["color.white","color.line","spacing.5"]}
],interactions:[{trigger:"primary.click",action:"confirm",target:"primary"},{trigger:"proof.change",action:"show-panel",target:"proof"}]}); }

function assetRequests(brief:DesignBrief):AssetRequest[]{const config=surfaceConfig[brief.surface];return [AssetRequestSchema.parse({id:`asset-${brief.id}-cover`,kind:brief.surface==="live-launch"?"live-promo":"cover",prompt:`Editorial creator visual for ${brief.title}. ${config.headline}. Bold cut-paper geometry, visible process texture, no logos.`,aspectRatio:"4:5",palette:["#10110F","#CBFF45","#FF6D5A","#563FCC"],constraints:["Original identity only","No legible third-party marks","Keep central text-safe area"],variants:2,status:"ready",provider:"deterministic-demo",parameters:{seed:42,style:"signal-garden-v1"}}),AssetRequestSchema.parse({id:`asset-${brief.id}-sticker`,kind:"sticker",prompt:`Modular sticker set expressing ${brief.tone.join(", ")}.`,aspectRatio:"1:1",palette:["#CBFF45","#FF6D5A","#10110F"],constraints:["Readable at 48px","No text","High silhouette contrast"],variants:2,status:"ready",provider:"deterministic-demo",parameters:{seed:84,style:"signal-garden-v1"}})];}

function critique(spec:PrototypeSpec):AgentCritique {return AgentCritiqueSchema.parse({agent:"visual-qa",summary:spec.revision===0?"Hierarchy is strong; supporting copy needs more breathing room before approval.":"Revised spacing resolves the only visual QA note.",severity:spec.revision===0?"note":"pass",findings:spec.revision===0?[{category:"spacing",message:"Increase the gap between hero copy and primary action.",blockId:"hero"}]:[],revisionRequired:spec.revision===0});}
function accessibility(spec:PrototypeSpec):AgentCritique {const invalid=spec.blocks.filter((block)=>!componentContractMap[block.component]);return AgentCritiqueSchema.parse({agent:"accessibility-validation",summary:invalid.length?"Unapproved components block rendering.":"Schema, whitelist, labels, and interaction contracts pass fixture validation.",severity:invalid.length?"blocker":"pass",findings:invalid.map((block)=>({category:"component-whitelist",message:`${block.component} is not approved.`,blockId:block.id})),revisionRequired:invalid.length>0});}

export async function runMockWorkflow(rawBrief:unknown,{simulateLatency=false}:{simulateLatency?:boolean}={}):Promise<WorkflowResult>{
  const started=performance.now(); const startedAt=new Date().toISOString(); const brief=DesignBriefSchema.parse(rawBrief); const traces:AgentTrace[]=[];
  const step=async<T>(agent:AgentName,delay:number,fn:()=>T)=>{const before=performance.now();if(simulateLatency)await sleep(delay);const value=fn();return{value,latency:Math.max(1,Math.round(performance.now()-before))}};
  const analysis=await step("brief-analyst",120,()=>analyze(brief));traces.push(trace("brief-analyst",{brief},analysis.value,[{tool:"validate_design_brief",arguments:{schema:"DesignBrief"},result:"valid"}],analysis.latency,"Mapped the brief without changing source content."));
  const library=await step("system-librarian",90,()=>({components:["PrototypeFrame","Badge","Card","Button","Tabs","AssetCard"],tokens:["color.ink","color.lime","color.coral","color.violet","spacing.8","radius.lg"],constraints:["whitelist-only rendering","visible focus states","reduced-motion fallback"]}));traces.push(trace("system-librarian",analysis.value,library.value,[{tool:"list_components",arguments:{purpose:"campaign prototype"},result:"6 approved contracts"},{tool:"list_design_tokens",arguments:{theme:"signal-garden"},result:"6 relevant tokens"}],library.latency,"Returned the narrowest permitted component set."));
  const plan=planFor(brief);let prototype=compose(brief,0);const composed=await step("prototype-composer",170,()=>prototype);traces.push(trace("prototype-composer",{analysis:analysis.value,library:library.value,plan}, {prototype:composed.value},[{tool:"validate_prototype_spec",arguments:{id:prototype.id},result:"valid"}],composed.latency,"Rendered a structured spec; no generated JavaScript accepted."));
  const assets=assetRequests(brief);const directed=await step("asset-art-director",110,()=>assets);traces.push(trace("asset-art-director",{briefId:brief.id,palette:library.value.tokens},{requests:directed.value},[{tool:"get_brand_constraints",arguments:{system:"signal-garden"},result:"4 colors, 3 constraints"}],directed.latency,"Created deterministic demo requests with provider provenance."));
  const firstCritique=await step("visual-qa",80,()=>critique(prototype));traces.push(trace("visual-qa",{prototypeId:prototype.id},{critique:firstCritique.value},[{tool:"inspect_visual_hierarchy",arguments:{viewport:"375x690"},result:"1 note"}],firstCritique.latency,"Requested one bounded spacing revision."));
  let revisionLoops=0;if(firstCritique.value.revisionRequired&&revisionLoops<2){revisionLoops++;prototype=compose(brief,revisionLoops);traces.push(trace("prototype-composer",{prototypeId:prototype.id,critique:firstCritique.value},{revision:prototype.revision},[{tool:"validate_prototype_spec",arguments:{revision:prototype.revision},result:"valid"}],2,"Applied only the requested spacing revision.","revised"));}
  const a11y=await step("accessibility-validation",70,()=>accessibility(prototype));traces.push(trace("accessibility-validation",{prototypeId:prototype.id},{critique:a11y.value},[{tool:"validate_prototype_spec",arguments:{id:prototype.id},result:a11y.value.severity==="pass"?"valid":"invalid"},{tool:"check_accessibility_contracts",arguments:{blocks:prototype.blocks.length},result:"passed"}],a11y.latency,"Approved the spec for deterministic rendering."));
  const totalLatencyMs=Math.max(1,Math.round(performance.now()-started));traces.push(trace("orchestrator",{briefId:brief.id,maxRevisionLoops:2},{status:"completed",revisionLoops,totalLatencyMs},[{tool:"persist_shared_state",arguments:{scope:"workflow-run"},result:"immutable result returned"}],1,"Completed with bounded revision history and no silent state mutation."));
  return {brief,plan,prototype,assets,critiques:[firstCritique.value,a11y.value],traces,revisionLoops,startedAt,completedAt:new Date().toISOString(),totalLatencyMs,provider:"mock"};
}
