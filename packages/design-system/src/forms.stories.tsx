import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Select, Textarea } from "./index";
const meta={title:"Design System/Forms",component:Input,tags:["autodocs"],args:{label:"Field"}} satisfies Meta<typeof Input>;export default meta;type Story=StoryObj<typeof meta>;
export const CompleteForm:Story={render:()=> <div style={{display:"grid",gap:16,width:420}}><Input label="Campaign name" name="campaign" placeholder="Make It In Public" hint="Use a concise working title."/><Select label="Aspect ratio" name="ratio" options={[{label:"Portrait · 4:5",value:"4:5"},{label:"Vertical · 9:16",value:"9:16"}]}/><Textarea label="Creative brief" name="brief" rows={5} defaultValue="Invite emerging creators into a seven-day public making challenge."/></div>};
export const ErrorState:Story={render:()=> <Input label="Campaign name" name="campaign-error" error="Campaign name is required."/>};
