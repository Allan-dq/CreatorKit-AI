import OpenAI from "openai";
import type { ZodType } from "zod";

export interface ProviderUsage { inputTokens:number|null; outputTokens:number|null; costUsd:number|null; }
export interface StructuredProvider {
  readonly name:string;
  readonly model:string;
  generateObject<T>(schema:ZodType<T>, system:string, input:unknown):Promise<{data:T;usage:ProviderUsage;latencyMs:number}>;
}

export class OpenAIResponsesProvider implements StructuredProvider {
  readonly name="openai";
  readonly model:string;
  private client:OpenAI;
  constructor({apiKey,model,timeoutMs=24000,maxRetries=1}:{apiKey:string;model:string;timeoutMs?:number;maxRetries?:number}) {
    this.model=model;
    this.client=new OpenAI({apiKey,timeout:timeoutMs,maxRetries});
  }
  async generateObject<T>(schema:ZodType<T>, system:string,input:unknown) {
    const started=performance.now();
    const response=await this.client.responses.create({
      model:this.model,
      instructions:`${system}\nReturn exactly one JSON object and no Markdown. The object must satisfy the supplied requirements.`,
      input:JSON.stringify(input),
      max_output_tokens:2400,
      store:false,
    });
    let parsed:unknown;
    try { parsed=JSON.parse(response.output_text); } catch { throw new Error("Provider returned non-JSON output."); }
    return { data:schema.parse(parsed), latencyMs:Math.round(performance.now()-started), usage:{inputTokens:response.usage?.input_tokens??null,outputTokens:response.usage?.output_tokens??null,costUsd:null} };
  }
}

export function getConfiguredProvider():StructuredProvider|null {
  const provider=process.env.CREATOR_KIT_AI_PROVIDER??"mock";
  if(provider==="mock") return null;
  if(provider!=="openai") throw new Error(`Unsupported provider: ${provider}`);
  const apiKey=process.env.OPENAI_API_KEY;
  const model=process.env.CREATOR_KIT_AI_MODEL;
  if(!apiKey||!model) throw new Error("OPENAI_API_KEY and CREATOR_KIT_AI_MODEL are required for the OpenAI provider.");
  return new OpenAIResponsesProvider({apiKey,model});
}
