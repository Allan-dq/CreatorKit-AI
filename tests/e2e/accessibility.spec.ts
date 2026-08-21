import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/studio", "/design-system", "/agents", "/evaluations", "/case-study"];

for (const route of routes) {
  test(`${route} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("studio tabs are keyboard navigable", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByTestId("run-workflow")).toBeEnabled();
  const prototypeTab = page.getByRole("tab", { name: "Prototype" });
  await prototypeTab.focus();
  await prototypeTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Asset variants" })).toBeFocused();
  await expect(page.getByRole("tabpanel", { name: "Asset variants" })).toBeVisible();
});
