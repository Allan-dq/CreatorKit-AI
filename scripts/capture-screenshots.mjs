import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.CREATOR_KIT_SCREENSHOT_URL ?? "http://localhost:3000";
const output = fileURLToPath(new URL("../docs/screenshots/", import.meta.url));
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const browserErrors = [];
desktop.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
desktop.on("pageerror", (error) => browserErrors.push(error.message));

await desktop.goto(`${baseURL}/`, { waitUntil: "networkidle" });
await desktop.screenshot({ path: join(output, "landing-desktop.png"), fullPage: true });

await desktop.goto(`${baseURL}/studio`, { waitUntil: "networkidle" });
await desktop.getByTestId("run-workflow").click();
await desktop.getByText("Run complete", { exact: true }).waitFor();
await desktop.screenshot({ path: join(output, "studio-generated-desktop.png"), fullPage: true });

await desktop.goto(`${baseURL}/design-system`, { waitUntil: "networkidle" });
await desktop.screenshot({ path: join(output, "design-system-desktop.png"), fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
mobile.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
mobile.on("pageerror", (error) => browserErrors.push(error.message));
await mobile.goto(`${baseURL}/studio`, { waitUntil: "networkidle" });
await mobile.getByTestId("run-workflow").click();
await mobile.getByText("Run complete", { exact: true }).waitFor();
await mobile.getByRole("button", { name: "Dismiss notification" }).click();
const studioTabsY = await mobile.getByRole("tablist", { name: "Studio output" }).evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
await mobile.evaluate((y) => window.scrollTo(0, y), studioTabsY);
await mobile.screenshot({ path: join(output, "studio-generated-mobile.png"), fullPage: false });

await browser.close();
if (browserErrors.length) throw new Error(`Browser console errors:\n${browserErrors.join("\n")}`);
console.log("Captured 4 screenshots with no browser console errors.");
