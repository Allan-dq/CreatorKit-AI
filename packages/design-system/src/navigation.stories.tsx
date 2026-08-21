import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bot, Boxes, Sparkles } from "lucide-react";
import { Badge, Sidebar, Tabs, Toast } from "./index";
const meta={title:"Design System/Navigation & Feedback",component:Tabs,tags:["autodocs"],args:{items:[],value:"one",onValueChange:()=>undefined}} satisfies Meta<typeof Tabs>;export default meta;type Story=StoryObj<typeof meta>;
function KeyboardTabsExample(){const [value,setValue]=useState("one");return <Tabs value={value} onValueChange={setValue} items={[{value:"one",label:"Prototype",content:<p>Validated prototype view</p>},{value:"two",label:"Assets",content:<p>Asset comparison view</p>},{value:"three",label:"Trace",content:<p>Structured trace view</p>}]}/>}
export const KeyboardTabs:Story={render:()=> <KeyboardTabsExample/>};
export const ProductSidebar:Story={parameters:{layout:"fullscreen"},render:()=> <div style={{height:520}}><Sidebar activePath="/studio" items={[{href:"/studio",label:"Studio",icon:<Sparkles/>},{href:"/system",label:"System",icon:<Boxes/>},{href:"/agents",label:"Agents",icon:<Bot/>}]} footer={<Badge variant="accent">Mock mode</Badge>}/></div>};
export const ToastMessages:Story={render:()=> <div className="inline-toast-demo"><Toast title="Label stored" message="Marked as human-authored." variant="success"/><Toast title="Validation note" message="One spacing issue remains." variant="warning"/></div>};
