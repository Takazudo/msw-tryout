import { test, expect } from '@playwright/test';

test.describe('Gallery with MSW - Empty Results', () => {
  test.beforeEach(async ({ page, context }) => {
    // Enable MSW and set scenario to 'empty' via localStorage
    await context.addInitScript(() => {
      localStorage.setItem('msw_enabled', 'true');
      localStorage.setItem('msw_scenario', 'empty');
    });
  });

  test('should show "no results" message when API returns 0 items', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that "no results" or "no items" message is visible
    // This test is expected to fail initially because this UI doesn't exist yet
    const noResultsMessage = page.getByText(/no (results|items|gallery items)/i);
    await expect(noResultsMessage).toBeVisible();
  });

  test('should hide pagination when API returns 0 items', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that pagination is NOT visible
    // This test is expected to fail initially because pagination hiding logic doesn't exist yet
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).not.toBeVisible();
  });
});

test.describe('Gallery with MSW - Item Count Validation', () => {
  test('should render correct number of items matching API response', async ({ page, context }) => {
    // Enable MSW with default scenario (260 items)
    await context.addInitScript(() => {
      localStorage.setItem('msw_enabled', 'true');
      localStorage.setItem('msw_scenario', 'default');
    });

    await page.goto('/');

    // Wait for the gallery to load
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Count the number of gallery items rendered
    const galleryItems = page.locator('[data-testid="gallery-thumbnail-grid"] a');
    const itemCount = await galleryItems.count();

    // Default should show 30 items per page
    expect(itemCount).toBe(30);
  });

  test('should render 5 items when API returns 5 items', async ({ page, context }) => {
    // Set MSW scenario to 'few' (5 items)
    await context.addInitScript(() => {
      localStorage.setItem('msw_enabled', 'true');
      localStorage.setItem('msw_scenario', 'few');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    const galleryItems = page.locator('[data-testid="gallery-thumbnail-grid"] a');
    const itemCount = await galleryItems.count();

    expect(itemCount).toBe(5);
  });

  test('should render 1 item when API returns single item', async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.setItem('msw_enabled', 'true');
      localStorage.setItem('msw_scenario', 'single');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    const galleryItems = page.locator('[data-testid="gallery-thumbnail-grid"] a');
    const itemCount = await galleryItems.count();

    expect(itemCount).toBe(1);
  });
});

test.describe('Gallery with MSW - Pagination', () => {
  test('should hide pagination when total pages is 1 or less', async ({ page, context }) => {
    // Set MSW scenario to 'few' (5 items = 1 page)
    await context.addInitScript(() => {
      localStorage.setItem('msw_enabled', 'true');
      localStorage.setItem('msw_scenario', 'few');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Pagination should be hidden when there's only one page
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).not.toBeVisible();
  });

  test('should show pagination when total pages is greater than 1', async ({ page, context }) => {
    // Default scenario has 260 items = 9 pages
    await context.addInitScript(() => {
      localStorage.setItem('msw_enabled', 'true');
      localStorage.setItem('msw_scenario', 'default');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Pagination should be visible
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();
  });
});
