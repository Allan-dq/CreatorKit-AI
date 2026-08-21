import { createInterface } from "node:readline";
import { designSystemTools } from "./tools";

type ToolName=keyof typeof designSystemTools;
const lines=createInterface({input:process.stdin,terminal:false});
lines.on("line",async(line)=>{
  try{
    const request=JSON.parse(line) as {id:string|number;tool:ToolName;input:never};
    if(!(request.tool in designSystemTools))throw new Error(`Unknown tool: ${request.tool}`);
    const result=await (designSystemTools[request.tool] as (input:never)=>unknown)(request.input??{} as never);
    process.stdout.write(`${JSON.stringify({id:request.id,result})}\n`);
  }catch(error){process.stdout.write(`${JSON.stringify({error:error instanceof Error?error.message:"Unknown error"})}\n`);}
});
