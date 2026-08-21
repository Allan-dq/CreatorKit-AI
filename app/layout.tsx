import type { Metadata } from "next";
import { headers } from "next/headers";
import "../packages/design-tokens/generated/tokens.css";
import "../packages/design-system/src/design-system.css";
import "./globals.css";
import "./asset-actions.css";

export async function generateMetadata():Promise<Metadata>{
  const requestHeaders=await headers();
  const host=requestHeaders.get("x-forwarded-host")??requestHeaders.get("host")??"localhost:3000";
  const protocol=requestHeaders.get("x-forwarded-proto")??(host.startsWith("localhost")?"http":"https");
  const base=new URL(`${protocol}://${host}`);
  return {metadataBase:base,title:{default:"CreatorKit AI",template:"%s · CreatorKit AI"},description:"Agentic design system and generative asset studio for creator teams.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{type:"website",url:base,title:"CreatorKit AI",description:"Brief → system → prototype → evidence.",images:[{url:new URL("/og.png",base).toString(),width:1680,height:945,alt:"CreatorKit AI agentic design workflow"}]},twitter:{card:"summary_large_image",title:"CreatorKit AI",description:"Brief → system → prototype → evidence.",images:[new URL("/og.png",base).toString()]}};
}

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" data-theme="light"><body>{children}</body></html>;}
