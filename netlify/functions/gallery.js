import { galleryData, getThumbnailUrl, getEnlargedImageUrl, getGalleryItemBySlug } from './gallery-data.js';

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
    // Get pagination parameters from query string
    const queryParams = event.queryStringParameters || {};
    const page = parseInt(queryParams.page || '1', 10);
    const limit = parseInt(queryParams.limit || '30', 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid pagination parameters' }),
      };
    }

    // Get all gallery items with URLs
    const itemsWithUrls = galleryData.map((item) => ({
      ...item,
      thumbnailUrl: getThumbnailUrl(item.slug),
      enlargedUrl: getEnlargedImageUrl(item.slug),
    }));

    const totalItems = itemsWithUrls.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated items
    const paginatedItems = itemsWithUrls.slice(startIndex, endIndex);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        items: paginatedItems,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
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
