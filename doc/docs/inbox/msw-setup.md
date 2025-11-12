# MSW (Mock Service Worker) Setup

This document explains how to use MSW (Mock Service Worker) in the MSW Tryout project for API mocking during development and testing.

## Overview

MSW is integrated into the project to enable:
- **Development with mocked APIs**: Test UI behavior without depending on Netlify Functions
- **E2E testing with controlled scenarios**: Test edge cases like empty results, single items, etc.
- **Faster test execution**: No need to wait for real API responses

## Installation

MSW is already installed in the project:

```bash
cd app
pnpm add -D msw
```

The service worker file is located at: `app/public/mockServiceWorker.js`

## Project Structure

```
app/
├── mocks/
│   ├── browser.ts          # MSW browser setup
│   ├── handlers.ts         # API mock handlers
│   └── data.ts            # Mock data scenarios
├── components/
│   └── msw-provider.tsx   # MSW initialization component
└── tests/
    ├── e2e-real.spec.ts       # Tests against real Netlify API
    ├── e2e-msw.spec.ts        # MSW-based tests (default)
    └── e2e-msw-edge.spec.ts   # MSW edge case tests
```

## Running the App with MSW

### Development Mode with MSW

To run the Next.js app with MSW enabled:

```bash
# From root directory
pnpm run dev:app-mock

# Or from app directory
cd app
pnpm run dev:mock
```

This will:
1. Start Next.js dev server on port 3200
2. Enable MSW by setting `NEXT_PUBLIC_ENABLE_MSW=true`
3. Intercept all API calls to `/api/gallery` and `/api/gallery-item`

### Normal Development Mode (Without MSW)

To run without MSW (using real Netlify Functions):

```bash
# From root directory
pnpm run dev

# Or from app directory
cd app
pnpm run dev
```

## Mock Data Scenarios

MSW supports multiple data scenarios for testing different cases:

### Available Scenarios

| Scenario | Description | Items Count |
|----------|-------------|-------------|
| `default` | Real-like data with pagination | 260 items |
| `empty` | Empty results (zero items) | 0 items |
| `single` | Single item only | 1 item |
| `exact-page` | Exactly one full page | 30 items |
| `few` | Few items (less than one page) | 5 items |

### Switching Scenarios

Scenarios are controlled via the `window.__MSW_SCENARIO__` variable:

```typescript
// Set scenario in browser console or test setup
window.__MSW_SCENARIO__ = 'empty';
```

For e2e tests, use `page.addInitScript()`:

```typescript
await page.addInitScript(() => {
  window.__MSW_SCENARIO__ = 'empty';
});
```

## E2E Testing

### MSW-Based Tests (Default)

MSW tests are the default for e2e testing:

```bash
# Run all MSW tests
cd app
pnpm run test:e2e

# Or explicitly
pnpm run test:e2e:msw

# UI mode
pnpm run test:e2e:ui

# Debug mode
pnpm run test:e2e:debug
```

**Configuration**: Uses `playwright-msw.config.ts`
- Runs against port 3200 (Next.js dev server with MSW)
- Only runs tests matching `**/e2e-msw*.spec.ts`
- Automatically starts dev server with MSW enabled

### Real API Tests (Manual)

To test against real Netlify Functions:

```bash
cd app
pnpm run test:e2e:real
```

**Configuration**: Uses default `playwright.config.ts`
- Runs against port 8888 (Netlify Dev proxy)
- Only runs `tests/e2e-real.spec.ts`
- **Not run automatically in CI**

## Test Coverage

### MSW-Based Tests (`e2e-msw.spec.ts`)

1. **Empty Results**
   - ✅ Shows "no results" message when API returns 0 items
   - ✅ Hides pagination when API returns 0 items
   - ⚠️ **Expected to fail initially** (UI not implemented yet)

2. **Item Count Validation**
   - ✅ Renders correct number of items matching API response
   - ✅ Validates different page sizes

3. **Pagination Visibility**
   - ✅ Hides pagination when total pages ≤ 1
   - ✅ Shows pagination when total pages > 1

### Edge Case Tests (`e2e-msw-edge.spec.ts`)

- Exactly 30 items (one full page)
- Pagination navigation with mock data
- Modal dialog with mock data
- Gallery item detail API validation
- Direct link with slug parameter
- API response structure validation

## Mock Handler Details

### Gallery List API (`GET /api/gallery`)

```typescript
http.get('/api/gallery', ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '30', 10);

  const dataset = getDataset(); // Gets data based on current scenario
  const response = paginateItems(dataset, page, limit);

  return HttpResponse.json(response);
});
```

### Gallery Item API (`GET /api/gallery-item`)

```typescript
http.get('/api/gallery-item', ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  const item = dataset.find((item) => item.slug === slug);
  return HttpResponse.json(item);
});
```

## Debugging MSW

### Check if MSW is Running

When MSW is enabled, you'll see this in the browser console:

```
[MSW] Mocking enabled
```

### View Network Requests

MSW intercepts requests in the browser DevTools Network tab:
- Intercepted requests show `[MSW]` in the response
- Status codes and responses come from mock handlers

### Disable MSW Temporarily

```typescript
// In browser console
worker.stop();

// Re-enable
worker.start();
```

## Environment Variables

| Variable | Description | Values |
|----------|-------------|--------|
| `NEXT_PUBLIC_ENABLE_MSW` | Enable/disable MSW | `'true'` or `undefined` |

## CI/CD Considerations

- **MSW tests**: Run automatically in CI (fast, predictable)
- **Real API tests**: Manual only (require Netlify infrastructure)

## Common Issues

### Issue: MSW not intercepting requests

**Solution**: Ensure `NEXT_PUBLIC_ENABLE_MSW=true` is set and check browser console for `[MSW] Mocking enabled`

### Issue: Tests fail with "no results" message

**Solution**: This is expected! The UI implementation for "no results" doesn't exist yet. The tests are validating the testing approach.

### Issue: Service worker not found (404)

**Solution**: Run `pnpm exec msw init public/` to regenerate the service worker file

## References

- [MSW Documentation](https://mswjs.io/)
- [MSW with Next.js](https://mswjs.io/docs/integrations/next)
- [Playwright Testing](https://playwright.dev/)

## Next Steps

After MSW setup, you should:

1. Implement the "no results" UI component
2. Add pagination hiding logic when `totalPages <= 1`
3. Run the MSW tests to verify the implementation
4. Add more mock scenarios as needed
