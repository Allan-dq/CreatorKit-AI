import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Trash2 } from "lucide-react";
import { Badge, Button, IconButton, Tooltip } from "./index";

const meta={title:"Design System/Actions",component:Button,tags:["autodocs"],parameters:{docs:{description:{component:"Action components use native controls, tokenized states, and visible keyboard focus."}}}} satisfies Meta<typeof Button>;
export default meta;type Story=StoryObj<typeof meta>;
export const ButtonVariants:Story={render:()=> <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Button>Generate</Button><Button variant="secondary">Review</Button><Button variant="ghost">Cancel</Button><Button variant="danger"><Trash2 size={14}/>Delete</Button><Button loading>Generating</Button><Button disabled>Disabled</Button></div>};
export const IconButtonWithTooltip:Story={render:()=> <Tooltip content="Open notifications"><IconButton label="Open notifications"><Bell size={16}/></IconButton></Tooltip>};
export const StatusBadges:Story={render:()=> <div style={{display:"flex",gap:8}}><Badge>Draft</Badge><Badge variant="success" dot>Validated</Badge><Badge variant="warning" dot>Review</Badge><Badge variant="danger" dot>Failed</Badge><Badge variant="accent">Human</Badge></div>};
