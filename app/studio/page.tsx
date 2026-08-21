import type { Metadata } from "next";
import { StudioClient } from "./studio-client";

export const metadata:Metadata={title:"Studio",description:"Run a structured brief-to-prototype workflow with inspectable specialist agents."};
export default function StudioPage(){return <StudioClient/>;}
