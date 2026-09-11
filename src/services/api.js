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
import { mockRules } from '../data/rules';

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

/**
 * Reusable helper to make HTTP requests to the backend with auto-attached JWT headers
 * @param {string} endpoint - API path (e.g. '/teams')
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
async function fetchAPI(endpoint, options = {}) {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';

  // Never use cache for /media endpoints, non-GET mutations, or explicit bypass
  if (isGet && !endpoint.startsWith('/media') && !options.bypassCache && !endpoint.startsWith('/admin')) {
    const cached = apiCache.get(endpoint);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }
  }

  // Clear cache on mutations
  if (!isGet) {
    apiCache.clear();
  }


  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('bgmi_esports_admin_token');
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), options.timeout || 12000) : null;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      ...(controller && { signal: controller.signal }),
    });

    if (timeoutId) clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    if (isGet && !options.bypassCache && !endpoint.startsWith('/admin')) {
      apiCache.set(endpoint, { data, timestamp: Date.now() });
    }

    return data;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}

// ==================== TEAMS API ====================
export async function getTeams(filter = 'All', searchQuery = '', bypassCache = false) {
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

    const res = await fetchAPI(url, bypassCache ? { bypassCache: true } : {});
    let teams = Array.isArray(res?.data) ? res.data : (res?.data || CANONICAL_TEAMS);

    // Normalize team properties so both name and teamName exist
    teams = teams.map((t) => ({
      ...t,
      name: t.name || t.teamName,
      teamName: t.teamName || t.name,
      shortName: t.shortName || (t.name || t.teamName || '').substring(0, 5).toUpperCase(),
      captain: typeof t.captain === 'object' ? t.captain : {
        name: t.captainName || (typeof t.captain === 'string' ? t.captain : 'Team Captain'),
        phone: t.contactNumber || t.captainPhone || '',
        email: t.email || t.captainEmail || ''
      }
    }));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      teams = teams.filter((t) =>
        t.name?.toLowerCase().includes(q) ||
        t.teamName?.toLowerCase().includes(q) ||
        t.shortName?.toLowerCase().includes(q) ||
        t.captain?.name?.toLowerCase().includes(q) ||
        t.captainName?.toLowerCase().includes(q)
      );
    }

    // Local filters for complex criteria
    if (filter === 'Top Teams') {
      teams = teams.filter((t) => t.rank > 0 && t.rank <= 5);
    }

    return teams;
  } catch (err) {
    console.error('getTeams failed, returning canonical fallback:', err);
    return CANONICAL_TEAMS;
  }
}

export async function getTeamById(id) {
  try {
    const res = await fetchAPI(`/teams/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    console.error('getTeamById failed:', err);
  }
  return CANONICAL_TEAMS.find((t) => t.id === id || t.shortName === id || t.registrationId === id) || CANONICAL_TEAMS[0];
}

export async function registerTeam(registrationData) {
  apiCache.clear();
  try {
    const res = await fetchAPI('/teams/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
    apiCache.clear();
    return {
      success: res.success,
      registrationId: res.data?.registrationId,
      team: res.data?.team
    };
  } catch (err) {
    apiCache.clear();
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
export async function getMatches(filter = 'All', bypassCache = false) {
  try {
    let url = '/matches';
    if (filter !== 'All') {
      url += `?status=${filter}`;
    }
    const res = await fetchAPI(url, { bypassCache });
    const data = Array.isArray(res?.data) ? res.data : [];
    if (filter !== 'All') {
      return data.filter((m) => m.status === filter);
    }
    return data;
  } catch (err) {
    console.error('getMatches failed:', err);
    return [];
  }
}

export async function getMatchById(id) {
  try {
    const res = await fetchAPI(`/matches/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    console.error('getMatchById failed:', err);
  }
  return CANONICAL_MATCHES.find((m) => String(m.id) === String(id) || String(m.matchNumber) === String(id)) || CANONICAL_MATCHES[0];
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
  apiCache.clear();
  try {
    const res = await fetchAPI(`/matches/${matchId}`, {
      method: 'DELETE',
    });
    apiCache.clear();
    return res;
  } catch (err) {
    console.error('deleteMatch failed:', err);
    throw err;
  }
}

export async function bulkDeleteMatches(ids) {
  apiCache.clear();
  try {
    const res = await fetchAPI('/matches/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    apiCache.clear();
    return res;
  } catch (err) {
    console.error('bulkDeleteMatches failed:', err);
    throw err;
  }
}

// ==================== STANDINGS API ====================
export async function getStandings() {
  try {
    const res = await fetchAPI('/standings');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error('getStandings failed:', err);
  }
  return getStandingsData();
}

export async function getScoringRules() {
  try {
    const res = await fetchAPI('/standings/rules');
    if (res.data && Object.keys(res.data).length > 0) return res.data;
  } catch (err) {
    console.error('getScoringRules failed:', err);
  }
  return {
    placementPoints: [
      { rank: 1, points: 10 },
      { rank: 2, points: 7 },
      { rank: 3, points: 0 },
      { rank: 4, points: 0 }
    ]
  };
}

// ==================== RESULTS API ====================
export async function getResults() {
  try {
    const res = await fetchAPI('/results');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error('getResults failed:', err);
  }
  return getResultsData();
}

export async function getResultById(id) {
  try {
    const res = await fetchAPI(`/results/${id}`);
    if (res.data) return res.data;
  } catch (err) {
    // Result may not exist yet for upcoming/live matches — this is expected
    console.warn('getResultById: No result found for match', id);
  }
  // Try local fallback only if it matches the requested id
  const fallback = getResultsData().find((r) => String(r.id) === String(id) || String(r.matchNumber) === String(id));
  return fallback || null;
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
    const list = res.data || [];
    return list.map((item) => {
      const formattedUrl = getMediaImageUrl(item);
      return {
        ...item,
        imageUrl: formattedUrl,
        thumbnail: formattedUrl,
      };
    });
  } catch (err) {
    console.error('getMedia failed:', err);
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
    return { success: res.success };
  } catch (err) {
    console.error('deleteMedia failed:', err);
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
    return res.data || [];
  } catch (err) {
    console.error('getAnnouncements failed:', err);
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
    if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn('getRules API failed, using official fallback:', err);
  }
  return mockRules;
}

// ==================== TOURNAMENT API ====================
export async function getTournament() {
  try {
    const res = await fetchAPI('/tournament');
    if (res.data) return res.data;
  } catch (err) {
    // ignore
  }

  try {
    const [teams, matches] = await Promise.all([
      getTeams('All', '', true).catch(() => []),
      getMatches('All', true).catch(() => []),
    ]);

    const liveOrNext = matches.find((m) => m.status === 'Live' || m.status === 'Upcoming');

    return {
      tournamentName: 'NIT BGMI Esports Championship 2026',
      status: 'Active',
      registeredSquads: teams.length,
      verifiedPlayers: teams.reduce((acc, t) => acc + (t.players?.length || 0), 0),
      totalMatches: matches.length,
      matchesPlayed: matches.filter((m) => m.status === 'Completed').length,
      currentRound: liveOrNext?.round || 'Grand Finals',
      nextMatch: liveOrNext || null,
    };
  } catch (e) {
    console.warn('getTournament failed:', e);
  }

  return {
    tournamentName: 'NIT BGMI Esports Championship 2026',
    status: 'Active',
    registeredSquads: 0,
    verifiedPlayers: 0,
    totalMatches: 0,
    matchesPlayed: 0,
    currentRound: 'Standby',
    nextMatch: null,
  };
}

// ==================== PLAYERS & MVP API ====================
export async function getPlayers() {
  try {
    const res = await fetchAPI('/players');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn('getPlayers failed:', err);
  }
  return getPlayerData();
}

export async function getPlayerStats() {
  return getPlayers();
}

export async function getMVP() {
  try {
    const res = await fetchAPI('/mvp');
    if (res.data && res.data.topMvp) return res.data;
  } catch (err) {
    console.warn('getMVP failed:', err);
  }
  const players = getPlayerData();
  return {
    topMvp: players[0] || null,
    players
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
  apiCache.clear();
  try {
    const res = await fetchAPI(`/players/${playerId}`, {
      method: 'DELETE',
    });
    apiCache.clear();
    return res;
  } catch (err) {
    console.warn('deletePlayer failed:', err);
    return null;
  }
}

export async function bulkDeletePlayers(playerIds) {
  apiCache.clear();
  if (!Array.isArray(playerIds) || playerIds.length === 0) return true;

  try {
    const res = await fetchAPI('/players/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: playerIds }),
    });
    apiCache.clear();
    return res?.success !== false;
  } catch (err) {
    console.warn('bulkDeletePlayers API failed, fallback to sequential deletes:', err);
    await Promise.all(playerIds.map((id) => deletePlayer(id)));
    apiCache.clear();
    return true;
  }
}

// ==================== AUTH SERVICES ====================
export async function loginAdmin(email, password) {
  try {
    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bgmi_esports_admin_token', res.token);
        localStorage.setItem('bgmi_esports_admin_user', JSON.stringify(res.user));
      }
    }
    return res;
  } catch (err) {
    console.error('loginAdmin failed:', err.message);
    return { success: false, message: err.message || 'Invalid credentials' };
  }
}

export async function getAdminDashboardStats() {
  try {
    const res = await fetchAPI('/admin/dashboard');
    return res.data || {};
  } catch (err) {
    console.error('getAdminDashboardStats failed:', err);
    return {};
  }
}

export async function getAdminAuditLogs() {
  try {
    const res = await fetchAPI('/admin/audit-logs');
    return res.data || [];
  } catch (err) {
    console.error('getAdminAuditLogs failed:', err);
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

export async function createTeam(teamData) {
  apiCache.clear();
  try {
    const res = await fetchAPI('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
    apiCache.clear();
    return res.data || res.team || res;
  } catch (err) {
    console.error('createTeam failed:', err);
    throw err;
  }
}

export async function deleteTeam(id) {
  try {
    const res = await fetchAPI(`/teams/${id}`, {
      method: 'DELETE',
    });
    return res;
  } catch (err) {
    console.warn('deleteTeam failed:', err);
    return null;
  }
}
