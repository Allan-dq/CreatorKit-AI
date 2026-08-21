import { describe, expect, it } from "vitest";
import { DesignBriefSchema, PreferenceLabelSchema, PrototypeSpecSchema } from "@/packages/shared-schemas/src";
import { sampleBriefs } from "@/packages/agent-workflows/src";
describe("shared schemas",()=>{
  it("validates all sample briefs",()=>expect(sampleBriefs.every((brief)=>DesignBriefSchema.safeParse(brief).success)).toBe(true));
  it("rejects executable component names",()=>{const result=PrototypeSpecSchema.safeParse({id:"bad",name:"Bad",viewport:{width:375,height:690},theme:"light",layout:"launch",blocks:[{id:"x",component:"script",variant:"default",props:{},content:[],tokenRefs:["color.ink"]}],interactions:[],source:"mock",revision:0});expect(result.success).toBe(false);});
  it("distinguishes human labels with literal provenance",()=>{const base={id:"1",createdAt:new Date().toISOString(),briefId:"brief-live",preferredVariant:"A",visualHierarchy:4,contrast:4,readability:4,brandConsistency:4,contentClarity:4,compositionQuality:4,feedback:"Clear hierarchy"};expect(PreferenceLabelSchema.safeParse({...base,provenance:"human"}).success).toBe(true);expect(PreferenceLabelSchema.safeParse({...base,provenance:"synthetic"}).success).toBe(false);});
});
