"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, Check, FlaskConical, Gauge, Heart, ImageIcon, Keyboard, MonitorSmartphone, ShieldCheck, TriangleAlert } from "lucide-react";
import { AppShell } from "@/app/_components/AppShell";
import { Badge, Button, Card, Tabs } from "@/packages/design-system/src";
import { runMockWorkflow, sampleBriefs } from "@/packages/agent-workflows/src";
import { evaluatePrototype, evaluationToMarkdown } from "@/packages/evaluation/src";
import { PreferenceLabelSchema, type EvaluationResult, type PreferenceLabel } from "@/packages/shared-schemas/src";
import baseline from "@/data/evaluation-baseline.json";

const getLabels=():PreferenceLabel[]=>{try{return PreferenceLabelSchema.array().parse(JSON.parse(localStorage.getItem("creator-kit-preference-labels")??"[]"));}catch{return[];}};
const download=(name:string,content:string,type:string)=>{const url=URL.createObjectURL(new Blob([content],{type}));const link=document.createElement("a");link.href=url;link.download=name;link.click();URL.revokeObjectURL(url);};

export function EvaluationsClient(){
  const [tab,setTab]=useState("overview");const [labels,setLabels]=useState<PreferenceLabel[]>([]);const [fixture,setFixture]=useState<EvaluationResult|null>(null);
  useEffect(()=>{let cancelled=false;Promise.resolve().then(async()=>{const stored=getLabels();const workflow=await runMockWorkflow(sampleBriefs[1]);if(cancelled)return;setLabels(stored);setFixture(evaluatePrototype(workflow.prototype,{latencyMs:workflow.totalLatencyMs,evidence:{humanPreferenceLabels:stored.length}}));});return()=>{cancelled=true};},[]);
  const averages=useMemo(()=>{if(!labels.length)return null;const keys=["visualHierarchy","contrast","readability","brandConsistency","contentClarity","compositionQuality"] as const;return Object.fromEntries(keys.map((key)=>[key,Math.round((labels.reduce((sum,label)=>sum+label[key],0)/labels.length)*10)/10]));},[labels]);
  const exportReport=()=>fixture&&download("creator-kit-evaluation-report.md",evaluationToMarkdown({...fixture,humanPreferenceLabels:labels.length}),"text/markdown");
  const exportJsonl=()=>download("creator-kit-human-preferences.jsonl",labels.map((label)=>JSON.stringify(label)).join("\n")+(labels.length?"\n":""),"application/jsonl");
  return <AppShell title="Evaluation Lab" eyebrow="EVIDENCE / REPRODUCIBLE" description="Measured results stay separate from synthetic critique and hypothetical business impact." actions={<><Badge variant={baseline.measuredAt?"success":"warning"} dot>{baseline.measuredAt?"Browser suite measured":"Partial measurement"}</Badge><Button variant="secondary" size="sm" onClick={exportReport} disabled={!fixture}><ArrowDownToLine size={14}/>Export report</Button></>}>
    <div className="evaluation-hero"><div className="evaluation-score"><span>SPEC COMPLIANCE</span><b>{fixture?`${fixture.tokenCompliance.percentage}%`:"—"}</b><p>{fixture?`${fixture.tokenCompliance.passed} of ${fixture.tokenCompliance.total} token references passed in the generated fixture.`:"Calculating the local fixture…"}</p></div><div className="evidence-boundary"><TriangleAlert size={20}/><div><b>Evidence boundary</b><p>Revenue and creator conversion are hypothetical downstream metrics. Synthetic agent critiques are not counted as human labels. Any suite not executed reads “Not measured.”</p></div></div></div>
    <Tabs value={tab} onValueChange={setTab} items={[
      {value:"overview",label:"Quality dashboard",content:<QualityDashboard fixture={fixture}/>},
      {value:"preferences",label:`Human preferences (${labels.length})`,content:<PreferenceDashboard labels={labels} averages={averages} onExport={exportJsonl}/>},
      {value:"method",label:"Methodology",content:<Methodology/>},
    ]}/>
  </AppShell>;
}

function metricValue(value:unknown){if(typeof value==="string")return value;if(value===null)return"Not measured";return String(value)}
function QualityDashboard({fixture}:{fixture:EvaluationResult|null}){const metrics=[
  {icon:<ShieldCheck/>,label:"Schema validity",value:fixture?(fixture.schemaValid?"Pass":"Fail"):"Calculating",detail:"Zod / PrototypeSpec"},
  {icon:<FlaskConical/>,label:"Unit tests",value:metricValue(baseline.unitTests),detail:"Schemas · tokens · workflow"},
  {icon:<Gauge/>,label:"MCP smoke tests",value:metricValue(baseline.mcpSmokeTests),detail:"5 design-system tools"},
  {icon:<Check/>,label:"A11y violations",value:metricValue(baseline.accessibilityViolations),detail:"axe-core / primary flow"},
  {icon:<Keyboard/>,label:"Keyboard checks",value:metricValue(baseline.keyboardChecks),detail:"Tabs · dialog · workflow"},
  {icon:<MonitorSmartphone/>,label:"Responsive checks",value:metricValue(baseline.responsiveChecks),detail:"Mobile · tablet · desktop"},
  {icon:<ImageIcon/>,label:"Visual regression",value:metricValue(baseline.visualRegression),detail:"Reference screenshots"},
  {icon:<Gauge/>,label:"Generation latency",value:fixture?`${fixture.generationLatencyMs}ms`:"Calculating",detail:"Local deterministic fixture"},
];return <div><div className="quality-grid">{metrics.map((metric)=><Card key={metric.label}><div className="quality-icon">{metric.icon}</div><span>{metric.label}</span><b className={String(metric.value).includes("Not measured")?"is-unmeasured":""}>{metric.value}</b><small>{metric.detail}</small></Card>)}</div><div className="metric-table"><div><b>Metric</b><b>Source</b><b>Latest evidence</b><b>Status</b></div>{[{m:"Design-token compliance",s:"Static spec evaluation",e:fixture?`${fixture.tokenCompliance.passed}/${fixture.tokenCompliance.total} refs`:"Calculating",ok:!!fixture},{m:"Approved component usage",s:"Whitelist validator",e:fixture?`${fixture.componentUsage.valid} valid / ${fixture.componentUsage.invalid} invalid`:"Calculating",ok:!!fixture&&!fixture.componentUsage.invalid},{m:"Agent failures / retries",s:"Mock orchestrator trace",e:fixture?`${fixture.agentFailures} / ${fixture.agentRetries}`:"Calculating",ok:!!fixture},{m:"Production bundle",s:"Local build",e:metricValue(baseline.productionBuild),ok:baseline.productionBuild==="Pass"}].map((row)=><div key={row.m}><b>{row.m}</b><span>{row.s}</span><span>{row.e}</span><Badge variant={row.ok?"success":"warning"}>{row.ok?"Measured":"Pending"}</Badge></div>)}</div></div>}
function PreferenceDashboard({labels,averages,onExport}:{labels:PreferenceLabel[];averages:Record<string,number>|null;onExport:()=>void}){return <div className="preference-dashboard">{labels.length?<><div className="preference-summary"><Card variant="ink"><Heart/><span>Human labels</span><b>{labels.length}</b><small>Stored on this device</small></Card>{Object.entries(averages??{}).map(([key,value])=><Card key={key}><span>{key.replace(/([A-Z])/g," $1")}</span><b>{value}<small>/5</small></b><div className="score-bar"><i style={{width:`${(value/5)*100}%`}}/></div></Card>)}</div><div className="label-list">{labels.map((label)=><article key={label.id}><div><Badge variant="accent">human</Badge><b>Preferred {label.preferredVariant}</b><time>{new Date(label.createdAt).toLocaleString()}</time></div><p>{label.feedback||"No free-form feedback provided."}</p><code>{label.briefId}</code></article>)}</div></>:<div className="no-labels"><span><Heart/></span><h3>No human labels yet</h3><p>Compare two variants in Studio to record the first preference. Synthetic demo data is intentionally excluded.</p></div>}<Button variant="secondary" disabled={!labels.length} onClick={onExport}><ArrowDownToLine size={14}/>Export JSONL</Button></div>}
function Methodology(){return <div className="method-grid">{[{n:"A",title:"Spec checks",body:"Zod validates structure. The MCP-compatible tool rejects unknown components. Token references are checked against governed categories."},{n:"B",title:"Browser checks",body:"Playwright exercises the primary journey at mobile, tablet, and desktop widths. axe-core inspects the rendered Studio state."},{n:"C",title:"Preference evidence",body:"Only explicit user submissions enter the human dataset. AI critiques and deterministic demo assets keep separate provenance."},{n:"D",title:"Reproducibility",body:"Mock mode uses fixed prompts, seeds, schemas, and a two-revision ceiling. Reports include measured timestamps and Not measured fallbacks."}].map((item)=><Card key={item.n} eyebrow={`METHOD ${item.n}`} title={item.title}><p>{item.body}</p></Card>)}</div>}
