import { z } from "zod";
import { DesignBriefSchema, PrototypePlanSchema, PrototypeSpecSchema, AssetRequestSchema, AgentCritiqueSchema } from "@/packages/shared-schemas/src";
import { componentContracts } from "@/packages/design-system/src/contracts";
import { getConfiguredProvider } from "@/packages/agent-workflows/src/provider";
import { runMockWorkflow } from "@/packages/agent-workflows/src";

export async function POST(request:Request){
  try{
    const body=await request.json() as {brief:unknown;mode?:"mock"|"provider"};
    const brief=DesignBriefSchema.parse(body.brief);
    if((body.mode??"mock")==="mock")return Response.json(await runMockWorkflow(brief,{simulateLatency:false}));
    const provider=getConfiguredProvider();
    if(!provider)return Response.json({error:"Provider mode is not configured. Set CREATOR_KIT_AI_PROVIDER, CREATOR_KIT_AI_MODEL, and the provider API key."},{status:503});
    const started=performance.now();
    const allowed=componentContracts.map(({name,purpose,variants,tokens,accessibility})=>({name,purpose,variants,tokens,accessibility}));
    const plan=await provider.generateObject(PrototypePlanSchema,"You are the Prototype Planner. Translate the validated brief into a concise interaction and component plan. Use only allowed component names.",{brief,allowedComponents:allowed});
    const prototype=await provider.generateObject(PrototypeSpecSchema,"You are the Prototype Composer. Return a deterministic PrototypeSpec. Set source to provider, use revision 0, include only whitelisted components and design token references. Do not output executable code.",{brief,plan:plan.data,allowedComponents:allowed});
    const assets=await provider.generateObject(z.array(AssetRequestSchema).min(1).max(3),"You are the Asset Art Director. Return structured image requests that use the supplied brand palette and contain no third-party brands.",{brief,palette:["#10110F","#F4F1E9","#CBFF45","#FF6D5A","#563FCC"]});
    const critique=await provider.generateObject(AgentCritiqueSchema,"You are the Visual QA Critic. Review only the supplied spec for hierarchy, spacing, contrast, consistency, brand fit, content clarity, and interaction quality. Do not invent rendered evidence.",{brief,spec:prototype.data});
    return Response.json({brief,plan:plan.data,prototype:prototype.data,assets:assets.data,critiques:[critique.data],provider:provider.name,totalLatencyMs:Math.round(performance.now()-started),usage:{plan:plan.usage,prototype:prototype.usage,assets:assets.usage,critique:critique.usage},note:"Provider output is schema-validated before it reaches the deterministic renderer."});
  }catch(error){
    if(error instanceof z.ZodError)return Response.json({error:"Schema validation failed",issues:error.issues},{status:422});
    return Response.json({error:error instanceof Error?error.message:"Workflow failed"},{status:500});
  }
}
