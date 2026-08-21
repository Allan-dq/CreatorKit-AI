import type { Metadata } from "next";
import { DesignSystemClient } from "./system-client";
export const metadata:Metadata={title:"Design system",description:"Explore Signal Garden tokens, components, contracts, and accessibility constraints."};
export default function DesignSystemPage(){return <DesignSystemClient/>;}
