// API configuration and helper
// Based on the correct API endpoints from /src/js/app.js

// AWS API Gateway endpoints (from root /src/js/app.js)
const DISPLAY_API = 'https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/filing-alert/display';
const DETAILS_API = 'https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/filing-alert/details';
const SEARCH_API = 'https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/document-indexer/atlas-search';

export const API_BASE =
  ((import.meta as any).env?.VITE_API_BASE as string) ||
  'https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod';

/**
 * Fetch filing display data (dashboard, metrics, filtered results)
 * Supports query params: search, district, assets, liabilities, industry, date_from, date_to, page, page_size
 */
export async function getFilings(params?: URLSearchParams | Record<string, string>) {
  const url = new URL(DISPLAY_API);
  
  if (params instanceof URLSearchParams) {
    url.search = params.toString();
  } else if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  return apiFetch(url.toString());
}

/**
 * Fetch detailed case information by file_name
 */
export async function getCaseDetails(fileName: string) {
  const url = new URL(DETAILS_API);
  url.searchParams.append('file_name', fileName);
  return apiFetch(url.toString());
}

/**
 * Perform keyword or semantic search
 * @param searchType - 'keyword_search' or 'semantic_search'
 * @param query - Search query string
 * @param projId - Project ID (defaults to the static project)
 */
export async function performSearch(
  searchType: 'keyword_search' | 'semantic_search',
  query: string,
  projId: string = '68664c58719800b2107353b5'
) {
  // For keyword search, use the filing-alert/display endpoint with search parameter
  if (searchType === 'keyword_search') {
    const url = new URL(DISPLAY_API);
    url.searchParams.append('search', query);
    url.searchParams.append('page', '1');
    url.searchParams.append('page_size', '15');
    
    return apiFetch(url.toString());
  }

  // For semantic search, use the atlas-search endpoint
  const url = new URL(SEARCH_API);
  url.searchParams.append('search_type', searchType);
  url.searchParams.append('query', query);
  url.searchParams.append('proj_id', projId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const body = await parseJsonSafe(response);

  if (!response.ok) {
    const err = new Error(`Search failed: ${response.status} ${response.statusText}`);
    (err as any).status = response.status;
    (err as any).body = body;
    throw err;
  }

  // Parse the response body if it's a string (Lambda response format)
  let parsedBody = body;
  if (typeof body === 'string') {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = body;
    }
  }

  // Handle Lambda wrapper - if response has a 'body' field that contains the actual data
  if (parsedBody && typeof parsedBody.body === 'string') {
    try {
      return JSON.parse(parsedBody.body);
    } catch {
      // If body isn't JSON, return the parsed response as is
      return parsedBody;
    }
  }

  // If the response itself is wrapped with statusCode and body
  if (parsedBody && parsedBody.statusCode === 200 && parsedBody.body) {
    try {
      return typeof parsedBody.body === 'string' ? JSON.parse(parsedBody.body) : parsedBody.body;
    } catch {
      return parsedBody.body;
    }
  }

  return parsedBody;
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

/**
 * Low-level fetch wrapper that handles full URLs directly
 */
export async function apiFetch(fullUrl: string, options?: RequestInit) {
  const res = await fetch(fullUrl, options);
  const body = await parseJsonSafe(res);
  console.log('Raw API Response:', body);
  if (!res.ok) {
    const err = new Error(`API request failed: ${res.status} ${res.statusText}`);
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }

  // Unwrap Lambda response wrapper
  let unwrappedBody = body;
  
  // If response has statusCode and body, unwrap it
  if (body && typeof body === 'object' && body.statusCode && body.body) {
    try {
      if (typeof body.body === 'string') {
        unwrappedBody = JSON.parse(body.body);
      } else {
        unwrappedBody = body.body;
      }
      console.log('Unwrapped API Response:', unwrappedBody);
    } catch (e) {
      console.log('Failed to unwrap Lambda response, using body as-is');
      unwrappedBody = body.body || body;
    }
  }

  return unwrappedBody;
}

export default apiFetch;
