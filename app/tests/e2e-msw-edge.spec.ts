import { test, expect } from '@playwright/test';

test.describe('Gallery with MSW - Edge Cases', () => {
  test('should handle exactly 30 items (one full page)', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__MSW_SCENARIO__ = 'exact-page';
    });

    await page.goto('/?msw=exact-page');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Should render exactly 30 items
    const galleryItems = page.locator('[data-testid="gallery-thumbnail-grid"] a');
    const itemCount = await galleryItems.count();
    expect(itemCount).toBe(30);

    // Pagination should be hidden (only 1 page)
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).not.toBeVisible();
  });

  test('should handle pagination navigation with mock data', async ({ page }) => {
    // Default scenario has 260 items
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if next page link exists
    const nextLink = page.locator('[data-testid="pagination"] a:has-text("Next")');
    await expect(nextLink).toBeVisible();

    // Click next page
    await nextLink.click();
    await page.waitForURL(/\?page=2/);

    // Verify we're on page 2
    expect(page.url()).toContain('page=2');

    // Gallery should still be visible
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Should still have 30 items on page 2
    const galleryItems = page.locator('[data-testid="gallery-thumbnail-grid"] a');
    const itemCount = await galleryItems.count();
    expect(itemCount).toBe(30);

    // Previous link should now be visible
    const prevLink = page.locator('[data-testid="pagination"] a:has-text("Previous")');
    await expect(prevLink).toBeVisible();
  });

  test('should open modal with mock data', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Click the first gallery item
    const firstItem = page.locator('[data-testid="gallery-thumbnail-grid"] a').first();
    await firstItem.click();

    // Check that the dialog opens
    await expect(page.locator('[data-testid="gallery-dialog"]')).toBeVisible();

    // Check that the enlarged image is visible
    await expect(page.locator('[data-testid="gallery-dialog"] img')).toBeVisible();

    // Close the dialog
    await page.keyboard.press('Escape');

    // Verify dialog is closed
    await expect(page.locator('[data-testid="gallery-dialog"]')).not.toBeVisible();
  });

  test('should fetch gallery item detail from mock API', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click the first gallery item
    const firstItem = page.locator('[data-testid="gallery-thumbnail-grid"] a').first();
    await firstItem.click();

    // Wait for the API call to /api/gallery-item
    const apiResponse = await page.waitForResponse((response) =>
      response.url().includes('/api/gallery-item'),
    );

    // Check that API returns 200
    expect(apiResponse.status()).toBe(200);

    // Check that API returns JSON with expected structure
    const data = await apiResponse.json();
    expect(data).toHaveProperty('slug');
    expect(data).toHaveProperty('thumbnailUrl');
    expect(data).toHaveProperty('enlargedUrl');
    expect(data).toHaveProperty('blurhash');
  });

  test('should handle direct link with slug parameter', async ({ page }) => {
    // Navigate directly to a URL with slug parameter
    await page.goto('/?id=mock-panels-gallery-1');
    await page.waitForLoadState('networkidle');

    // Dialog should open automatically
    await expect(page.locator('[data-testid="gallery-dialog"]')).toBeVisible();

    // The enlarged image should be visible
    await expect(page.locator('[data-testid="gallery-dialog"] img')).toBeVisible();
  });

  test('should validate API response structure with mock data', async ({ page }) => {
    const response = await page.goto('/');
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
    expect(data.pagination).toHaveProperty('hasNextPage');
    expect(data.pagination).toHaveProperty('hasPreviousPage');
  });
});
