import type { Metadata } from "next";
import { EvaluationsClient } from "./evaluations-client";
export const metadata:Metadata={title:"Evaluations",description:"Review measured design-system, accessibility, workflow, responsive, and preference evidence."};
export default function EvaluationsPage(){return <EvaluationsClient/>;}
