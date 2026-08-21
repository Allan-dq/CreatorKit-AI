"use client";

import { usePathname } from "next/navigation";
import { Bot, Boxes, ChartNoAxesCombined, FileText, Home, Sparkles } from "lucide-react";
import { Badge, Sidebar } from "@/packages/design-system/src";

const nav=[
  {href:"/studio",label:"Studio",icon:<Sparkles size={17}/>},
  {href:"/design-system",label:"Design system",icon:<Boxes size={17}/>},
  {href:"/agents",label:"Agents",icon:<Bot size={17}/>},
  {href:"/evaluations",label:"Evaluations",icon:<ChartNoAxesCombined size={17}/>},
  {href:"/case-study",label:"Case study",icon:<FileText size={17}/>},
  {href:"/",label:"Overview",icon:<Home size={17}/>},
];

export function AppShell({children,title,eyebrow,description,actions}:{children:React.ReactNode;title:string;eyebrow:string;description:string;actions?:React.ReactNode}){
  const pathname=usePathname();
  return <div className="app-shell"><Sidebar items={nav} activePath={pathname} footer={<div className="shell-mode"><Badge variant="accent" dot>Mock mode</Badge><span>No API key required</span></div>}/><main className="app-main"><header className="page-header"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>{actions&&<div className="page-actions">{actions}</div>}</header>{children}</main></div>;
}
