import { getThumbnailUrl, getEnlargedImageUrl, getGalleryItemBySlug } from './gallery-data.js';

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get slug from query parameters
    const slug = event.queryStringParameters?.slug;

    if (!slug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Slug parameter is required' }),
      };
    }

    const item = getGalleryItemBySlug(slug);

    if (!item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Gallery item not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...item,
        thumbnailUrl: getThumbnailUrl(item.slug),
        enlargedUrl: getEnlargedImageUrl(item.slug),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
