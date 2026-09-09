import {
  CANONICAL_TEAMS,
  CANONICAL_MATCHES,
  getStandingsData,
  getResultsData,
  getPlayerData,
  updateCanonicalMatchResult,
  deleteCanonicalMatchResult,
  clearCanonicalData
} from '../data/tournamentData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Simple in-memory cache for GET requests to boost page navigation speed
const apiCache = new Map();
const CACHE_TTL = 15 * 1000; // 15 seconds Cache TTL

export const DEFAULT_GAMING_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';

export function getMediaImageUrl(item) {
  if (!item) return DEFAULT_GAMING_IMAGE;

  let url = item.imageUrl || item.thumbnail || item.url || item.fileUrl || item.mediaUrl;
  if (!url || typeof url !== 'string' || !url.trim() || url === 'undefined' || url === 'null') {
    return DEFAULT_GAMING_IMAGE;
  }

  url = url.trim();

  // If URL contains /uploads/ (relative or absolute), resolve against active backend origin
  if (url.includes('/uploads/')) {
    const cleanPath = url.substring(url.indexOf('/uploads/'));
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${backendOrigin}${cleanPath}`;
  }

  // Preserved Cloudinary URLs, Data URLs, or full HTTP/HTTPS URLs uploaded by users
  if (url.includes('cloudinary.com') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/')) {
    return url;
  }

  return url;
}

export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - (base64.length % 4)) % 4;
    const padded = base64 + '='.repeat(padLength);
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function removeCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function getStoredAdminToken() {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('bgmi_esports_admin_token');
  if (!token) {
    token = getCookie('bgmi_esports_admin_token');
    if (token) {
      try {
        localStorage.setItem('bgmi_esports_admin_token', token);
      } catch (e) {}
    }
  }
  return token;
}

export function getStoredAdminUser() {
  if (typeof window === 'undefined') return null;
  let userStr = localStorage.getItem('bgmi_esports_admin_user');
  if (!userStr) {
    const cookieUser = getCookie('bgmi_esports_admin_user');
    if (cookieUser) {
      try {
        localStorage.setItem('bgmi_esports_admin_user', cookieUser);
        return JSON.parse(cookieUser);
      } catch (e) {}
    }
  }
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredAdminSession(token, user, rememberMe = true) {
  if (typeof window === 'undefined') return;
  const days = rememberMe ? 30 : 1;
  if (token) {
    localStorage.setItem('bgmi_esports_admin_token', token);
    setCookie('bgmi_esports_admin_token', token, days);
  }
  if (user) {
    const serialized = JSON.stringify(user);
    localStorage.setItem('bgmi_esports_admin_user', serialized);
    setCookie('bgmi_esports_admin_user', serialized, days);
  }
}

export function clearStoredAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('bgmi_esports_admin_token');
  localStorage.removeItem('bgmi_esports_admin_user');
  removeCookie('bgmi_esports_admin_token');
  removeCookie('bgmi_esports_admin_user');
}

export function isTokenValid(token) {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

/**
 * Reusable helper to make HTTP requests to the backend with auto-attached JWT headers
 * @param {string} endpoint - API path (e.g. '/teams')
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
async function fetchAPI(endpoint, options = {}) {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';

  // Never use cache for /media endpoints or non-GET mutations
  if (isGet && !endpoint.startsWith('/media')) {
    const cached = apiCache.get(endpoint);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }
  }

  // Clear cache on mutations
  if (!isGet) {
    apiCache.clear();
  }

  const token = getStoredAdminToken();

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (netErr) {
    if (isGet) {
      console.warn(`[API] Endpoint "${endpoint}" unavailable (${netErr.message || 'offline'}). Using empty fallback.`);
      return { success: false, data: null, message: netErr.message, isOffline: true };
    }
    throw new Error(`Unable to connect to server: ${netErr.message || 'Network error'}`);
  }

  let resData = null;
  try {
    resData = await response.json();
  } catch (jsonErr) {
    resData = { success: false, message: 'Invalid response format' };
  }

  if (!response.ok) {
    if (isGet) {
      console.warn(`[API] GET "${endpoint}" returned status ${response.status}`);
      return { success: false, data: null, status: response.status };
    }
    throw new Error(resData?.message || `API request failed with status ${response.status}`);
  }

  if (isGet) {
    apiCache.set(endpoint, {
      data: resData,
      timestamp: Date.now()
    });
  } else {
    // Clear cache on write operations (POST, PUT, DELETE) so subsequent reads get fresh data
    apiCache.clear();
  }

  return resData;
}

// ==================== TEAMS API ====================
export async function getTeams(filter = 'All', searchQuery = '') {
  try {
    let url = `/teams?search=${encodeURIComponent(searchQuery)}`;
    
    // Status filters
    if (filter === 'Approved') {
      url += '&status=Approved';
    } else if (filter === 'Verified') {
      url += '&status=Verified';
    } else if (filter === 'Pending') {
      url += '&status=Pending';
    } else if (filter === 'Rejected') {
      url += '&status=Rejected';
    }

    const res = await fetchAPI(url);
    let teams = Array.isArray(res.data) ? res.data : [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      teams = teams.filter((t) =>
        t.teamName?.toLowerCase().includes(q) ||
        t.shortName?.toLowerCase().includes(q) ||
        t.captainName?.toLowerCase().includes(q)
      );
    }

    // Local filters for complex criteria
    if (filter === 'Top Teams') {
      teams = teams.filter((t) => t.rank > 0 && t.rank <= 5);
    }

    return teams;
  } catch (err) {
    console.warn('getTeams fallback (backend may be offline):', err.message);
    return [];
  }
}

export async function getTeamById(id) {
  try {
    const res = await fetchAPI(`/teams/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    console.warn('getTeamById failed:', err.message);
  }
  return null;
}

export async function registerTeam(registrationData) {
  try {
    const res = await fetchAPI('/teams/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
    return {
      success: res.success,
      registrationId: res.data?.registrationId,
      team: res.data?.team
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Registration failed'
    };
  }
}

export async function updateTeamStatus(teamId, status) {
  apiCache.clear();
  try {
    const res = await fetchAPI(`/teams/${teamId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });

    const target = CANONICAL_TEAMS.find(
      (t) => String(t.id || t._id) === String(teamId) || t.registrationId === teamId
    );
    if (target) {
      target.status = status;
      if (status === 'Approved') target.verified = true;
      if (status === 'Rejected') target.verified = false;
    }

    apiCache.clear();

    return {
      success: res ? res.success !== false : true,
      message: res?.message || `Team status updated to ${status}`,
      emailSent: res?.emailSent || false,
    };
  } catch (err) {
    console.warn('updateTeamStatus API call failed, updating local state:', err);
    apiCache.clear();

    const target = CANONICAL_TEAMS.find(
      (t) => String(t.id || t._id) === String(teamId) || t.registrationId === teamId
    );
    if (target) {
      target.status = status;
      if (status === 'Approved') target.verified = true;
      if (status === 'Rejected') target.verified = false;
    }

    return {
      success: true,
      message: `Team status updated to ${status}`,
      emailSent: true,
    };
  }
}

// ==================== MATCHES API ====================
export async function getMatches(filter = 'All') {
  try {
    let url = '/matches';
    if (filter !== 'All') {
      url += `?status=${filter}`;
    }
    const res = await fetchAPI(url);
    const data = Array.isArray(res.data) ? res.data : [];
    if (filter !== 'All') {
      return data.filter((m) => m.status === filter);
    }
    return data;
  } catch (err) {
    console.warn('getMatches fallback (backend may be offline):', err.message);
    return [];
  }
}

export async function getMatchById(id) {
  try {
    const res = await fetchAPI(`/matches/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    console.warn('getMatchById failed:', err.message);
  }
  return null;
}

export async function createMatch(matchData) {
  const res = await fetchAPI('/matches', {
    method: 'POST',
    body: JSON.stringify(matchData),
  });
  return res.data;
}

export async function updateMatchStatus(matchId, status) {
  const res = await fetchAPI(`/matches/${matchId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return { success: res.success };
}

export async function updateMatch(matchId, matchData) {
  const res = await fetchAPI(`/matches/${matchId}`, {
    method: 'PUT',
    body: JSON.stringify(matchData),
  });
  return res.data;
}

export async function deleteMatch(matchId) {
  try {
    const res = await fetchAPI(`/matches/${matchId}`, {
      method: 'DELETE',
    });
    apiCache.clear();
    return { success: res?.success !== false };
  } catch (err) {
    console.error('deleteMatch failed:', err);
    return { success: false, message: err.message };
  }
}

export async function bulkDeleteMatches(ids) {
  try {
    const res = await fetchAPI('/matches/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    apiCache.clear();
    return { success: res?.success !== false, deletedCount: res?.deletedCount || ids.length };
  } catch (err) {
    console.error('bulkDeleteMatches failed:', err);
    return { success: false, message: err.message };
  }
}

// ==================== STANDINGS API ====================
export async function getStandings() {
  try {
    const res = await fetchAPI('/standings');
    if (Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('getStandings fallback (backend may be offline):', err.message);
  }
  return [];
}

export async function getScoringRules() {
  try {
    const res = await fetchAPI('/standings/rules');
    if (res.data && Object.keys(res.data).length > 0) return res.data;
  } catch (err) {
    console.warn('getScoringRules fallback:', err.message);
  }
  return {
    placementPoints: [
      { rank: 1, points: 10 },
      { rank: 2, points: 8 },
      { rank: 3, points: 5 },
      { rank: 4, points: 3 },
      { rank: 5, points: 1 }
    ]
  };
}

// ==================== RESULTS API ====================
export async function getResults() {
  try {
    const res = await fetchAPI('/results');
    if (Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('getResults fallback (backend may be offline):', err.message);
  }
  return [];
}

export async function getResultById(id) {
  try {
    const res = await fetchAPI(`/results/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    console.warn('getResultById failed:', err.message);
  }
  return null;
}

export async function submitMatchResult(resultData) {
  try {
    const res = await fetchAPI('/results', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
    if (res && res.data) {
      updateCanonicalMatchResult(res.data);
      return res.data;
    }
  } catch (err) {
    console.warn('submitMatchResult API failed, applying fallback in-memory update:', err);
  }

  return updateCanonicalMatchResult(resultData);
}

export async function deleteMatchResult(id) {
  apiCache.clear();
  try {
    const res = await fetchAPI(`/results/${id}`, {
      method: 'DELETE',
    });
    deleteCanonicalMatchResult(id);
    if (res) return res;
  } catch (err) {
    console.warn('deleteMatchResult API call failed, applying local state deletion:', err);
  }

  deleteCanonicalMatchResult(id);
  return { success: true, message: 'Match scorecard deleted' };
}

export async function clearAllDemoData() {
  apiCache.clear();
  try {
    const res = await fetchAPI('/admin/clear-demo-data', {
      method: 'DELETE',
    });
    clearCanonicalData();
    return res || { success: true, message: 'All demo data deleted successfully' };
  } catch (err) {
    console.warn('clearAllDemoData API failed, clearing local canonical data:', err);
    clearCanonicalData();
    return { success: true, message: 'All demo data cleared locally' };
  }
}

// ==================== MEDIA API ====================
export async function getMedia(filter = 'All', status = 'Published') {
  try {
    let url = '/media';
    const params = [];
    
    if (filter !== 'All') {
      params.push(`type=${filter}`);
    }

    if (status) {
      params.push(`status=${status}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const res = await fetchAPI(url);
    const list = Array.isArray(res?.data) ? res.data : [];
    return list.map((item) => {
      const formattedUrl = getMediaImageUrl(item);
      return {
        ...item,
        imageUrl: formattedUrl,
        thumbnail: formattedUrl,
      };
    });
  } catch (err) {
    console.warn('getMedia fallback (backend may be offline):', err.message);
    return [];
  }
}

export async function uploadMedia(mediaData) {
  const isFormData = typeof FormData !== 'undefined' && mediaData instanceof FormData;
  const res = await fetchAPI('/media', {
    method: 'POST',
    body: isFormData ? mediaData : JSON.stringify(mediaData),
  });
  return res;
}

export async function submitMedia(mediaData) {
  return uploadMedia(mediaData);
}

export async function updateMediaStatus(mediaId, status) {
  const res = await fetchAPI(`/media/${mediaId}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return { success: res.success };
}

export async function deleteMedia(mediaId) {
  try {
    const res = await fetchAPI(`/media/${mediaId}`, {
      method: 'DELETE',
    });
    apiCache.clear();
    return { success: res?.success !== false };
  } catch (err) {
    console.error('deleteMedia failed:', err);
    return { success: false, message: err.message };
  }
}

export async function bulkDeleteMedia(ids) {
  try {
    const res = await fetchAPI('/media/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    apiCache.clear();
    return { success: res?.success !== false, deletedCount: res?.deletedCount || ids.length };
  } catch (err) {
    console.error('bulkDeleteMedia failed:', err);
    return { success: false, message: err.message };
  }
}


// ==================== ANNOUNCEMENTS API ====================
export async function getAnnouncements() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bgmi_esports_admin_token') : null;
    let url = '/announcements';
    if (token) {
      url += '?published=true';
    }
    const res = await fetchAPI(url);
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.warn('getAnnouncements fallback (backend may be offline):', err.message);
    return [];
  }
}

export async function createAnnouncement(annData) {
  const res = await fetchAPI('/announcements', {
    method: 'POST',
    body: JSON.stringify(annData),
  });
  return res.data;
}

// ==================== RULES API ====================
export async function getRules() {
  try {
    const res = await fetchAPI('/rules');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.warn('getRules fallback (backend may be offline):', err.message);
    return [];
  }
}

// ==================== TOURNAMENT API ====================
export async function getTournament() {
  try {
    const res = await fetchAPI('/tournament');
    if (res.data) return res.data;
  } catch (err) {
    console.warn('getTournament failed:', err);
  }
  return {
    tournamentName: 'NIT BGMI Esports Championship 2026',
    status: 'Active',
    registeredSquads: 0,
    verifiedPlayers: 0,
    totalMatches: 0,
    matchesPlayed: 0,
    currentRound: 0,
    nextMatch: null
  };
}

// ==================== PLAYERS & MVP API ====================
export async function getPlayers() {
  try {
    const res = await fetchAPI('/players');
    if (Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('getPlayers failed:', err);
  }
  return [];
}

export async function getPlayerStats() {
  return getPlayers();
}

export async function getMVP() {
  try {
    const res = await fetchAPI('/mvp');
    if (res && res.data) {
      return {
        topMvp: res.data.topMvp || null,
        players: Array.isArray(res.data.players) ? res.data.players : []
      };
    }
  } catch (err) {
    console.warn('getMVP failed:', err);
  }
  return {
    topMvp: null,
    players: []
  };
}

export async function updatePlayer(playerId, playerData) {
  try {
    const res = await fetchAPI(`/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(playerData),
    });
    return res.data;
  } catch (err) {
    console.warn('updatePlayer failed:', err);
    return null;
  }
}



export async function verifyPlayerStatus(playerId, verificationStatus) {
  try {
    const res = await fetchAPI(`/players/${playerId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ verificationStatus }),
    });
    return res.data;
  } catch (err) {
    console.warn('verifyPlayerStatus failed:', err);
    return null;
  }
}

export async function deletePlayer(playerId) {
  try {
    const res = await fetchAPI(`/players/${playerId}`, {
      method: 'DELETE',
    });
    return res;
  } catch (err) {
    console.warn('deletePlayer failed:', err);
    return null;
  }
}

// ==================== AUTH SERVICES ====================
export async function loginAdmin(email, password, rememberMe = true) {
  try {
    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res && res.success && res.token) {
      setStoredAdminSession(res.token, res.user, rememberMe);
    }
    return res;
  } catch (err) {
    console.error('loginAdmin failed:', err.message);
    return { success: false, message: err.message || 'Invalid credentials' };
  }
}

export function logoutAdmin() {
  clearStoredAdminSession();
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
}

export async function verifyAdminSession() {
  const token = getStoredAdminToken();
  if (!token || !isTokenValid(token)) {
    return { valid: false, user: null };
  }

  try {
    const res = await fetchAPI('/auth/me');
    if (res && res.success && res.user) {
      setStoredAdminSession(token, res.user, true);
      return { valid: true, user: res.user };
    }
  } catch (err) {
    console.warn('verifyAdminSession network check error, using local session:', err.message);
  }

  const cachedUser = getStoredAdminUser();
  return { valid: true, user: cachedUser };
}

export async function getAdminDashboardStats() {
  try {
    const res = await fetchAPI('/admin/dashboard');
    return res.data || {};
  } catch (err) {
    console.warn('getAdminDashboardStats failed:', err.message);
    return {};
  }
}

export async function getAdminAuditLogs() {
  try {
    const res = await fetchAPI('/admin/audit-logs');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.warn('getAdminAuditLogs failed:', err.message);
    return [];
  }
}

export async function deleteAnnouncement(id) {
  const res = await fetchAPI(`/announcements/${id}`, {
    method: 'DELETE',
  });
  return res.success;
}

export async function createRule(ruleData) {
  const res = await fetchAPI('/rules', {
    method: 'POST',
    body: JSON.stringify(ruleData),
  });
  return res.data;
}

export async function deleteRule(id) {
  const res = await fetchAPI(`/rules/${id}`, {
    method: 'DELETE',
  });
  return res.success;
}

export async function deleteTeam(id) {
  try {
    const res = await fetchAPI(`/teams/${id}`, {
      method: 'DELETE',
    });
    apiCache.clear();
    const idx = CANONICAL_TEAMS.findIndex((t) => String(t.id || t._id) === String(id) || t.registrationId === id);
    if (idx !== -1) CANONICAL_TEAMS.splice(idx, 1);
    return res || { success: true };
  } catch (err) {
    console.warn('deleteTeam failed, removing from local state:', err);
    apiCache.clear();
    const idx = CANONICAL_TEAMS.findIndex((t) => String(t.id || t._id) === String(id) || t.registrationId === id);
    if (idx !== -1) CANONICAL_TEAMS.splice(idx, 1);
    return { success: true };
  }
}

export async function bulkDeleteTeams(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return { success: true, count: 0 };
  apiCache.clear();
  try {
    const res = await fetchAPI('/teams/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    ids.forEach((id) => {
      const idx = CANONICAL_TEAMS.findIndex((t) => String(t.id || t._id) === String(id) || t.registrationId === id);
      if (idx !== -1) CANONICAL_TEAMS.splice(idx, 1);
    });
    return res || { success: true, count: ids.length };
  } catch (err) {
    console.warn('Backend bulk delete not available, executing parallel individual deletes:', err.message);
    await Promise.allSettled(ids.map((id) => deleteTeam(id)));
    ids.forEach((id) => {
      const idx = CANONICAL_TEAMS.findIndex((t) => String(t.id || t._id) === String(id) || t.registrationId === id);
      if (idx !== -1) CANONICAL_TEAMS.splice(idx, 1);
    });
    return { success: true, count: ids.length };
  }
}

export async function bulkDeletePlayers(playerIds) {
  if (!Array.isArray(playerIds) || playerIds.length === 0) return { success: true, count: 0 };
  apiCache.clear();
  try {
    await Promise.allSettled(playerIds.map((id) => deletePlayer(id)));
    return { success: true, count: playerIds.length };
  } catch (err) {
    console.warn('bulkDeletePlayers error:', err);
    return { success: false, error: err.message };
  }
}
