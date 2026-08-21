import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("brief to prototype, asset review, preference, evaluation, and export", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "Generation Studio" })).toBeVisible();

  await page.getByTestId("run-workflow").click();
  await expect(page.getByText("Run complete")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByLabel("One Hour / Three Makers / A")).toBeVisible();

  await page.getByRole("tab", { name: "Asset variants" }).click();
  await page.getByRole("button", { name: "Choose variant" }).last().click();
  await page.getByRole("button", { name: /Regenerate/ }).click();
  await expect(page.getByText("Variant regenerated")).toBeVisible();
  await page.getByTestId("approve-asset").click();
  await expect(page.getByText("Asset approved")).toBeVisible();

  await page.getByTestId("review-variants").click();
  await page.getByRole("radio", { name: /Variant B/ }).click();
  await page.getByLabel("Why did you choose it?").fill("Variant B has a clearer focal point and stronger silhouette contrast.");
  await page.getByTestId("submit-preference").click();
  await expect(page.getByText("Human label saved")).toBeVisible();

  await page.getByTestId("run-evaluation").click();
  await expect(page.getByText("Evidence boundary:")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export package/ }).click();
  expect((await downloadPromise).suggestedFilename()).toContain("artifact.json");

  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});
