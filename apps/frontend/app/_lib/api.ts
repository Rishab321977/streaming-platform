const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const fetchTrending = async () => {
  const res = await fetch(`${API_BASE_URL}/media/trending`);
  if (!res.ok) throw new Error('Failed to fetch trending media');
  return res.json();
};

export const fetchCatalog = async ({pageParam = ''}) => {
  const url = new URL(`${API_BASE_URL}/media`);

  if(pageParam) url.searchParams.append('cursor', pageParam);
  url.searchParams.append('limit', '20');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch media catalog');
  return res.json();
}

export const fetchMediaById = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/media/${id}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch media details');
  }
  return res.json();
}

export const toggleMediaInList = async (mediaId: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/users/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ mediaId }),
  });
  if (!res.ok) throw new Error('Failed to update list');
  return res.json();
}

// Add this new fetcher for server components
export const fetchMySavedList = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/users/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache' // Ensure we always get the freshest list
    }
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) return [];
    throw new Error('Failed to fetch saved list');
  }

  return res.json();
};