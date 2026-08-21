"use client";

import { useState } from "react";
import { ArrowRight, Bookmark, CalendarDays, Users } from "lucide-react";
import { Badge, Button, Card, Tabs } from "@/packages/design-system/src";
import { PrototypeSpecSchema, type PrototypeSpec } from "@/packages/shared-schemas/src";

export function PrototypeRenderer({spec}:{spec:PrototypeSpec}){
  const validated=PrototypeSpecSchema.parse(spec);
  const [tab,setTab]=useState("overview");
  const byId=Object.fromEntries(validated.blocks.map((block)=>[block.id,block]));
  const hero=byId.hero; const status=byId.status; const primary=byId.primary; const support=byId.support;
  return <div className={`rendered-prototype rendered-prototype--${validated.layout}`} data-prototype-id={validated.id}>
    <div className="rp-top"><span className="rp-logo">C</span><button aria-label="Save preview"><Bookmark size={15}/></button></div>
    <div className="rp-hero">
      <Badge variant="accent">{status?.content[0]}</Badge>
      <div className="rp-orbit rp-orbit--one"/><div className="rp-orbit rp-orbit--two"/>
      <h2>{hero?.content[0]}</h2><p>{hero?.content[1]}</p>
      <Button variant="primary">{primary?.content[0]}<ArrowRight size={15}/></Button>
    </div>
    <div className="rp-proof">
      <div><CalendarDays size={16}/><span>Format</span><b>{validated.layout==="launch"?"60 min live":"7 day sprint"}</b></div>
      <div><Users size={16}/><span>Built for</span><b>Curious makers</b></div>
    </div>
    <div className="rp-details">
      <Tabs variant="pill" value={tab} onValueChange={setTab} items={[
        {value:"overview",label:"Overview",content:<Card variant="outline"><strong>{support?.content[0]}</strong><p>{support?.content.slice(1).join(" · ")}</p></Card>},
        {value:"lineup",label:"Lineup",content:<Card variant="outline"><strong>Three distinct voices</strong><p>Process, critique, and the decisions between.</p></Card>},
        {value:"details",label:"Details",content:<Card variant="outline"><strong>Designed to be clear</strong><p>Keyboard-ready actions and a reduced-motion path.</p></Card>},
      ]}/>
    </div>
  </div>;
}
