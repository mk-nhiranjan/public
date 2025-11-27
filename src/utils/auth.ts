// Authentication utility for OpenID Connect flow

const AUTH_URL = 'https://auth.ch11.ai/realms/PROD_RKC_ADMIN/protocol/openid-connect/auth';
const LOGOUT_API = 'https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/auth/logout';
const CLIENT_ID = 'prod-rkc-frontend-app';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/login` : '';

// Storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const SESSION_EXPIRED_KEY = 'session_expired';

/**
 * Check if user is authenticated (token exists in localStorage)
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token;
}

/**
 * Get the current auth token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Mark session as expired (used to display a message after redirect)
 */
export function setSessionExpiredFlag(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(SESSION_EXPIRED_KEY, '1'); } catch {}
}

export function clearSessionExpiredFlag(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(SESSION_EXPIRED_KEY); } catch {}
}

export function hasSessionExpiredFlag(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SESSION_EXPIRED_KEY) === '1';
}

/**
 * Redirect to login page
 */
export function redirectToLogin(): void {
  const loginUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  window.location.href = loginUrl;
}

/**
 * Set authentication tokens after successful login
 */
export function setAuthTokens(token: string, refreshToken: string, expiresIn?: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
  // Clear any previous session-expired marker and start expiry watcher
  clearSessionExpiredFlag();
  startTokenExpiryWatcher();
}

/**
 * Clear all authentication tokens
 */
export function clearAuthTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Logout user and call the logout API
 */
export async function logout(keepSessionExpired = false): Promise<void> {
  const refreshToken = getRefreshToken();
  
  if (refreshToken) {
    try {
      const response = await fetch(LOGOUT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        console.error('Logout API error:', response.status);
      }
    } catch (error) {
      console.error('Failed to call logout API:', error);
    }
  }

  // Clear tokens regardless of API response
  clearAuthTokens();
  // Clear session expired marker unless caller wants to keep it
  if (!keepSessionExpired) {
    clearSessionExpiredFlag();
  }
  try {
    const w: any = window as any;
    if (w.__tokenExpiryTimer) {
      clearTimeout(w.__tokenExpiryTimer as number);
      w.__tokenExpiryTimer = null;
    }
  } catch {}

  // Redirect to home page
  window.location.href = '/';
}

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return false;
  return Date.now() > parseInt(expiry);
}

/**
 * Start a timer that will auto-logout the user when the token expiry time is reached.
 * Multiple calls are safe; previous timer will be cleared.
 */
export function startTokenExpiryWatcher(): void {
  if (typeof window === 'undefined') return;
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return;
    const expiryMs = parseInt(expiry, 10);
    const now = Date.now();
    const ms = expiryMs - now;

    const w: any = window as any;
    if (w.__tokenExpiryTimer) {
      clearTimeout(w.__tokenExpiryTimer as number);
      w.__tokenExpiryTimer = null;
    }

    if (ms <= 0) {
      // Already expired
      setSessionExpiredFlag();
      // fire-and-forget logout but keep the session-expired flag so UI can show
      logout(true);
      return;
    }

    // set a timeout to logout at expiry
    w.__tokenExpiryTimer = setTimeout(() => {
      try { setSessionExpiredFlag(); } catch {}
      // call logout (clears storage and redirects) but preserve the flag for UI
      try { logout(true); } catch {}
    }, ms + 1000);
  } catch (err) {
    // swallow errors; watcher is best-effort
    console.error('Failed to start token expiry watcher', err);
  }
}
