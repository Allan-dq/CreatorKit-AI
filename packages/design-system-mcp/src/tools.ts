import tokens from "../../design-tokens/src/tokens.json";
import { componentContracts, componentContractMap } from "../../design-system/src/contracts";
import { PrototypeSpecSchema } from "../../shared-schemas/src";

function flatten(node:Record<string,unknown>,trail:string[]=[],out:Record<string,unknown>={}) {
  for(const [key,value] of Object.entries(node)){
    if(key.startsWith("$")||key==="meta")continue;
    if(value&&typeof value==="object"&&"value" in value)out[[...trail,key].join(".")]=(value as {value:unknown}).value;
    else if(value&&typeof value==="object")flatten(value as Record<string,unknown>,[...trail,key],out);
  }
  return out;
}

const flatTokens=flatten(tokens as unknown as Record<string,unknown>);
export const designSystemTools={
  list_design_tokens(input:{category?:string}={}) { const entries=Object.entries(flatTokens).filter(([name])=>!input.category||name.startsWith(`${input.category}.`));return{tokens:Object.fromEntries(entries),count:entries.length}; },
  list_components(){return{components:componentContracts.map(({name,purpose,variants})=>({name,purpose,variants})),count:componentContracts.length};},
  get_component_contract(input:{name:string}){const contract=componentContractMap[input.name];if(!contract)throw new Error(`Unknown component: ${input.name}`);return contract;},
  search_design_patterns(input:{query:string}){const query=input.query.toLowerCase();const patterns=[{id:"campaign-hero",tags:["campaign","hero","cta"],components:["Badge","Card","Button"],guidance:"Lead with one expressive promise and one dominant action."},{id:"variant-compare",tags:["asset","compare","preference"],components:["AssetCard","Badge","Button"],guidance:"Keep variants equally sized and record provenance beside the choice."},{id:"agent-trace",tags:["agent","trace","validation"],components:["Card","Badge","Tabs"],guidance:"Show order, status, tool calls, latency, validation, and revisions."},{id:"mobile-launch",tags:["mobile","live","launch"],components:["PrototypeFrame","Badge","Button"],guidance:"Keep status and primary action visible without motion dependence."}];const results=patterns.filter((pattern)=>`${pattern.id} ${pattern.tags.join(" ")} ${pattern.guidance}`.toLowerCase().includes(query));return{results,count:results.length};},
  validate_prototype_spec(input:{spec:unknown}){const result=PrototypeSpecSchema.safeParse(input.spec);if(!result.success)return{valid:false,issues:result.error.issues.map((issue)=>({path:issue.path.join("."),message:issue.message}))};const unknown=result.data.blocks.filter((block)=>!componentContractMap[block.component]);return{valid:unknown.length===0,issues:unknown.map((block)=>({path:`blocks.${block.id}`,message:`${block.component} is not approved.`})),blockCount:result.data.blocks.length};},
};
export type DesignSystemTools=typeof designSystemTools;
