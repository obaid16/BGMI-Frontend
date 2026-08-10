const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Reusable helper to make HTTP requests to the backend with auto-attached JWT headers
 * @param {string} endpoint - API path (e.g. '/teams')
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
async function fetchAPI(endpoint, options = {}) {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('bgmi_esports_admin_token');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'API request failed');
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
    let teams = res.data || [];

    // Local filters for complex criteria
    if (filter === 'Top Teams') {
      teams = teams.filter((t) => t.rank > 0 && t.rank <= 5);
    }

    return teams;
  } catch (err) {
    console.error('getTeams failed, returning empty:', err);
    return [];
  }
}

export async function getTeamById(id) {
  try {
    const res = await fetchAPI(`/teams/${id}`);
    return res.data || null;
  } catch (err) {
    console.error('getTeamById failed:', err);
    return null;
  }
}

export async function registerTeam(registrationData) {
  const res = await fetchAPI('/teams/register', {
    method: 'POST',
    body: JSON.stringify(registrationData),
  });
  return {
    success: res.success,
    registrationId: res.data?.registrationId,
    team: res.data?.team
  };
}

export async function updateTeamStatus(teamId, status) {
  const res = await fetchAPI(`/teams/${teamId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return { success: res.success };
}

// ==================== MATCHES API ====================
export async function getMatches(filter = 'All') {
  try {
    let url = '/matches';
    if (filter !== 'All') {
      url += `?status=${filter}`;
    }
    const res = await fetchAPI(url);
    return res.data || [];
  } catch (err) {
    console.error('getMatches failed:', err);
    return [];
  }
}

export async function getMatchById(id) {
  try {
    const res = await fetchAPI(`/matches/${id}`);
    return res.data || null;
  } catch (err) {
    console.error('getMatchById failed:', err);
    return null;
  }
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

// ==================== STANDINGS API ====================
export async function getStandings() {
  try {
    const res = await fetchAPI('/standings');
    return res.data || [];
  } catch (err) {
    console.error('getStandings failed:', err);
    return [];
  }
}

export async function getScoringRules() {
  try {
    const res = await fetchAPI('/standings/rules');
    return res.data || {};
  } catch (err) {
    console.error('getScoringRules failed:', err);
    return {};
  }
}

// ==================== RESULTS API ====================
export async function getResults() {
  try {
    const res = await fetchAPI('/results');
    return res.data || [];
  } catch (err) {
    console.error('getResults failed:', err);
    return [];
  }
}

export async function getResultById(id) {
  try {
    const res = await fetchAPI(`/results/${id}`);
    return res.data || null;
  } catch (err) {
    console.error('getResultById failed:', err);
    return null;
  }
}

export async function submitMatchResult(resultData) {
  const res = await fetchAPI('/results', {
    method: 'POST',
    body: JSON.stringify(resultData),
  });
  return res.data;
}

// ==================== MEDIA API ====================
export async function getMedia(filter = 'All') {
  try {
    let url = '/media';
    const params = [];
    
    if (filter !== 'All') {
      params.push(`type=${filter}`);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('bgmi_esports_admin_token') : null;
    if (token) {
      params.push('status=All'); // Admin gets all (published, pending, rejected)
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const res = await fetchAPI(url);
    return res.data || [];
  } catch (err) {
    console.error('getMedia failed:', err);
    return [];
  }
}

export async function updateMediaStatus(mediaId, status) {
  const res = await fetchAPI(`/media/${mediaId}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return { success: res.success };
}

// ==================== ANNOUNCEMENTS API ====================
export async function getAnnouncements() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bgmi_esports_admin_token') : null;
    let url = '/announcements';
    if (token) {
      url += '?published=true'; // Modify if admins need unpublished
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
    return res.data || [];
  } catch (err) {
    console.error('getRules failed:', err);
    return [];
  }
}

// ==================== PLAYERS API ====================
export async function verifyPlayerStatus(playerId, verificationStatus) {
  try {
    const res = await fetchAPI(`/players/${playerId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ verificationStatus }),
    });
    return res.data;
  } catch (err) {
    console.error('verifyPlayerStatus failed:', err);
    return null;
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
