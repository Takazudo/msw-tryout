# MSW Tryout - Gallery Application

A simple gallery application built with Next.js and Netlify Functions for testing MSW (Mock Service Worker).

## Project Structure

```
msw-tryout/
├── netlify/
│   └── functions/        # Netlify Functions (serverless API)
│       ├── gallery.js        # Get all gallery items
│       ├── gallery-item.js   # Get single gallery item
│       └── gallery-data.js   # Shared data
├── app/                  # Next.js application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities and API client
│   └── package.json
├── netlify.toml          # Netlify configuration
└── package.json          # Root package.json
```

## Features

- Netlify Functions serving gallery data (serverless)
- Next.js app with TypeScript and Tailwind CSS
- Gallery thumbnail grid with lazy loading
- Modal dialog for enlarged images
- Keyboard navigation (arrow keys, ESC)
- Blurhash placeholders for progressive image loading

## Getting Started

### 1. Install Dependencies

Install dependencies for both root and app:

```bash
# Install root dependencies (netlify-cli)
npm install

# Install app dependencies
cd app
npm install
cd ..
```

### 2. Start the Development Servers

You need to run **two terminals**:

**Terminal 1 - Start Next.js (from app directory):**
```bash
cd app
npm run dev
```

**Terminal 2 - Start Netlify Dev (from root directory):**
```bash
npm run dev
```

This will:
- Terminal 1: Next.js dev server on port 3000
- Terminal 2: Netlify Dev proxy on port 8888 with Functions on port 9999

The app will be available at `http://localhost:8888` (Netlify Dev proxy)

## Usage

1. Open your browser to `http://localhost:8888`
2. Click on any thumbnail to view the enlarged image
3. Use arrow keys to navigate between images
4. Press ESC or click outside to close the modal
5. Click the close button (X) to close the modal

## API Endpoints

Netlify Functions are accessible via `/api/*` which redirects to `/.netlify/functions/*`:

### GET /api/gallery

Returns all gallery items with URLs.

**Response:**
```json
{
  "items": [
    {
      "slug": "panels-gallery-zudo-blocks-141",
      "imageAlt": "",
      "blurhash": "UFFNxM^d=D~9:kJ.o~EMnAnTIWNf%L=Z-6b^",
      "thumbnailUrl": "https://takazudomodular.com/static/images/p/panels-gallery-zudo-blocks-141/600w.webp",
      "enlargedUrl": "https://takazudomodular.com/static/images/p/panels-gallery-zudo-blocks-141/1600w.webp"
    }
  ],
  "total": 10
}
```

### GET /api/gallery-item?slug={slug}

Returns a single gallery item by slug.

**Example:** `/api/gallery-item?slug=panels-gallery-zudo-blocks-141`

**Response:**
```json
{
  "slug": "panels-gallery-zudo-blocks-141",
  "imageAlt": "",
  "blurhash": "UFFNxM^d=D~9:kJ.o~EMnAnTIWNf%L=Z-6b^",
  "thumbnailUrl": "https://takazudomodular.com/static/images/p/panels-gallery-zudo-blocks-141/600w.webp",
  "enlargedUrl": "https://takazudomodular.com/static/images/p/panels-gallery-zudo-blocks-141/1600w.webp"
}
```

## Tech Stack

### Backend (Netlify Functions)
- Netlify Functions (serverless)
- ES Modules

### Frontend (Next.js App)
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Heroicons
- Blurhash

## How It Works

### Netlify Dev

`netlify dev` provides local development environment that:
1. Runs your Next.js dev server
2. Serves Netlify Functions locally
3. Handles redirects defined in `netlify.toml`
4. Proxies everything through `http://localhost:8888`

### URL Redirects

The `netlify.toml` configuration redirects:
- `/api/*` → `/.netlify/functions/*`

So when the Next.js app calls `/api/gallery`, it actually hits `/.netlify/functions/gallery`.

## Next Steps (MSW Integration)

This setup is ready for MSW integration. You can:

1. Install MSW in the app
2. Create mock handlers for the Netlify Functions endpoints
3. Test the app with mocked data
4. Compare behavior between real Netlify Functions and mocked responses

## Reference

This project is based on the gallery implementation from:
https://panels.takazudomodular.com/gallery

The image organization and structure follows the documentation at:
`~/repos/personal/case-estimate/doc/docs/inbox/image-organization.md`

## Troubleshooting

### Port Conflicts

If port 8888, 3000, or 9999 are already in use, you can modify the ports in `netlify.toml`:

```toml
[dev]
  port = 8888           # Netlify Dev proxy port
  targetPort = 3000     # Next.js dev server port
  functionsPort = 9999  # Netlify Functions port
```

### Functions Not Working

Make sure you're running from the **root directory** with `npm run dev`, not from the `app/` directory.
