import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname="/") {
  const workerUrl=new URL("../dist/server/index.js",import.meta.url);workerUrl.searchParams.set("test",`${process.pid}-${Date.now()}`);const {default:worker}=await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${pathname}`,{headers:{accept:"text/html"}}),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
}

test("server-renders the finished product introduction",async()=>{const response=await render("/");assert.equal(response.status,200);assert.match(response.headers.get("content-type")??"",/^text\/html\b/i);const html=await response.text();assert.match(html,/CreatorKit AI/);assert.match(html,/From creative brief/);assert.match(html,/Start a generation/);assert.doesNotMatch(html,/codex-preview|Your site is taking shape|react-loading-skeleton/);});
test("all required product routes render",async()=>{for(const route of ["/studio","/design-system","/agents","/evaluations","/case-study"]){const response=await render(route);assert.equal(response.status,200,route);const html=await response.text();assert.match(html,/CreatorKit/);}});
test("starter preview is fully removed",async()=>{await assert.rejects(access(new URL("../app/_sites-preview",import.meta.url)));const [page,layout,pkg]=await Promise.all([readFile(new URL("../app/page.tsx",import.meta.url),"utf8"),readFile(new URL("../app/layout.tsx",import.meta.url),"utf8"),readFile(new URL("../package.json",import.meta.url),"utf8")]);assert.doesNotMatch(page,/_sites-preview|SkeletonPreview/);assert.doesNotMatch(layout,/Starter Project|codex-preview/);assert.doesNotMatch(pkg,/react-loading-skeleton/);});
