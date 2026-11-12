import { expect,test } from "@playwright/test";
test("studio empty state visual reference",async({page})=>{await page.setViewportSize({width:1440,height:1000});await page.goto("/studio");await expect(page.getByTestId("run-workflow")).toBeEnabled();await expect(page).toHaveScreenshot("studio-desktop.png",{fullPage:true,animations:"disabled",maxDiffPixelRatio:.01});});
