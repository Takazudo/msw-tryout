import { test, expect } from '@playwright/test';

test.describe('Gallery Smoke Test', () => {
  test('should load the gallery page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors (uncaught exceptions)
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    // Navigate to the app
    const response = await page.goto('/');

    // Check that the page loads successfully (not 404 or 500)
    expect(response?.status()).toBeLessThan(400);

    // Check that the gallery grid is visible
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Check that pagination is visible
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load a gallery item in modal', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for gallery to load
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Click the first gallery item
    const firstItem = page.locator('[data-testid="gallery-thumbnail-grid"] a').first();
    await firstItem.click();

    // Check that the dialog opens
    await expect(page.locator('[data-testid="gallery-dialog"]')).toBeVisible();

    // Check that the enlarged image is visible
    await expect(page.locator('[data-testid="gallery-dialog"] img')).toBeVisible();

    // Close the dialog (click backdrop or close button if available)
    await page.keyboard.press('Escape');

    // Verify dialog is closed
    await expect(page.locator('[data-testid="gallery-dialog"]')).not.toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for gallery to load
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Check if next page link exists
    const nextLink = page.locator('[data-testid="pagination"] a:has-text("Next")');
    const nextLinkCount = await nextLink.count();

    if (nextLinkCount > 0) {
      // Click next page link
      await nextLink.click();

      // Wait for URL to update
      await page.waitForURL(/\?page=2/);

      // Verify we're on page 2
      const url = page.url();
      expect(url).toContain('page=2');

      // Gallery should still be visible
      await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

      // Previous link should now be visible
      const prevLink = page.locator('[data-testid="pagination"] a:has-text("Previous")');
      await expect(prevLink).toBeVisible();
    }
  });

  test('should fetch gallery data from API', async ({ page }) => {
    // Navigate to the app
    const response = await page.goto('/');

    // Check that the page loads successfully
    expect(response?.status()).toBeLessThan(400);

    // Wait for the API call to /api/gallery
    const apiResponse = await page.waitForResponse((response) =>
      response.url().includes('/api/gallery'),
    );

    // Check that API returns 200
    expect(apiResponse.status()).toBe(200);

    // Check that API returns JSON with expected structure
    const data = await apiResponse.json();
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('pagination');
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThan(0);

    // Verify pagination structure
    expect(data.pagination).toHaveProperty('currentPage');
    expect(data.pagination).toHaveProperty('totalPages');
    expect(data.pagination).toHaveProperty('totalItems');
    expect(data.pagination).toHaveProperty('itemsPerPage');
  });

  test('should handle direct gallery item link', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for gallery to load
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Click the first gallery item to open modal
    const firstItem = page.locator('[data-testid="gallery-thumbnail-grid"] a').first();
    await firstItem.click();

    // Wait for dialog to open
    await expect(page.locator('[data-testid="gallery-dialog"]')).toBeVisible();

    // Get the URL which should include the id
    const url = page.url();
    expect(url).toContain('?id=');

    // Reload the page with the slug in URL
    await page.reload();

    // Dialog should open automatically with the slug in URL
    await expect(page.locator('[data-testid="gallery-dialog"]')).toBeVisible();

    // The enlarged image should be visible
    await expect(page.locator('[data-testid="gallery-dialog"] img')).toBeVisible();
  });
});
