/**
 * OIDC PKCE implementation for Shopify Customer Account API
 * Handles OAuth 2.0 with PKCE flow for secure authentication
 */

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

const STORAGE_KEY = 'shopify_customer_tokens';
const CODE_VERIFIER_KEY = 'pkce_code_verifier';
const STATE_KEY = 'oauth_state';
const NONCE_KEY = 'oauth_nonce';

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => charset[v % charset.length]).join('');
}

/**
 * Base64url encode a Uint8Array
 */
function b64url(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate a cryptographically secure base64url-safe random string
 */
function randB64url(byteLength: number): string {
  const buffer = new Uint8Array(byteLength);
  crypto.getRandomValues(buffer);
  return b64url(buffer);
}

/**
 * Generate SHA256 hash and base64url encode
 */
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return b64url(new Uint8Array(hash));
}

/**
 * Start the OAuth login flow
 * Generates PKCE parameters and redirects to Shopify authorization endpoint
 */
export async function startLogin(): Promise<void> {
  // Generate PKCE parameters - use 64-char verifier as specified
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await sha256(codeVerifier);
  const state = randB64url(16);
  const nonce = randB64url(16);

  // Store PKCE parameters for later use
  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
  localStorage.setItem(STATE_KEY, state);
  localStorage.setItem(NONCE_KEY, nonce);

  // Build authorization URL using new URL() with absolute VITE_SHOPIFY_CUSTOMER_AUTH_URL
  const authorizeUrl = new URL(import.meta.env.VITE_SHOPIFY_CUSTOMER_AUTH_URL);
  
  // Add required OAuth parameters
  authorizeUrl.searchParams.set('client_id', import.meta.env.VITE_SHOPIFY_CUSTOMER_APP_ID);
  authorizeUrl.searchParams.set('redirect_uri', import.meta.env.VITE_AUTH_REDIRECT_URI);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'openid email');
  authorizeUrl.searchParams.set('code_challenge', codeChallenge);
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('nonce', nonce);
  
  // Log the final authorization URL for debugging
  console.log('OAuth Authorization URL:', authorizeUrl.toString());
  console.log('Code verifier length:', codeVerifier.length);
  console.log('Code challenge (base64url SHA-256):', codeChallenge);
  console.log('State (base64url, 16 bytes):', state);
  console.log('Nonce (base64url, 16 bytes):', nonce);
  
  // Redirect to Shopify authorization endpoint
  window.location.href = authorizeUrl.toString();
}

/**
 * Handle the OAuth callback
 * Validates state and exchanges authorization code for tokens
 */
export async function handleCallback(searchParams: URLSearchParams): Promise<boolean> {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error, searchParams.get('error_description'));
    return false;
  }

  if (!code || !state) {
    console.error('Missing code or state parameter');
    return false;
  }

  // Validate state parameter
  const storedState = localStorage.getItem(STATE_KEY);
  if (state !== storedState) {
    console.error('State parameter mismatch');
    return false;
  }

  // Get stored PKCE parameters
  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);
  if (!codeVerifier) {
    console.error('Missing code verifier');
    return false;
  }

  try {
    // Exchange authorization code for tokens using VITE_SHOPIFY_CUSTOMER_TOKEN_URL
    const tokenResponse = await fetch(import.meta.env.VITE_SHOPIFY_CUSTOMER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: import.meta.env.VITE_SHOPIFY_CUSTOMER_APP_ID,
        code,
        redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        responseText: errorText
      });
      return false;
    }

    const tokens: TokenResponse = await tokenResponse.json();

    // Calculate expiration time
    const expiresAt = Date.now() + (tokens.expires_in * 1000);

    // Store tokens
    const storedTokens: StoredTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedTokens));

    // Clean up PKCE parameters
    localStorage.removeItem(CODE_VERIFIER_KEY);
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(NONCE_KEY);

    return true;
  } catch (error) {
    console.error('Error during token exchange:', error);
    return false;
  }
}

/**
 * Get stored tokens
 */
export function getStoredTokens(): StoredTokens | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if the current access token is valid (not expired)
 */
export function isTokenValid(): boolean {
  const tokens = getStoredTokens();
  if (!tokens) return false;

  // Check if token is expired (with 5 minute buffer)
  return tokens.expires_at > Date.now() + (5 * 60 * 1000);
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshToken(): Promise<boolean> {
  const tokens = getStoredTokens();
  if (!tokens?.refresh_token) {
    return false;
  }

  try {
    const response = await fetch(import.meta.env.VITE_SHOPIFY_CUSTOMER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: import.meta.env.VITE_SHOPIFY_CUSTOMER_APP_ID,
        refresh_token: tokens.refresh_token,
      }),
    });

    if (!response.ok) {
      console.error('Token refresh failed');
      return false;
    }

    const newTokens: TokenResponse = await response.json();
    const expiresAt = Date.now() + (newTokens.expires_in * 1000);

    const updatedTokens: StoredTokens = {
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token || tokens.refresh_token,
      expires_at: expiresAt,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTokens));
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

/**
 * Logout the user
 * Clears local storage and optionally hits the logout endpoint
 */
export async function logout(hitLogoutEndpoint = true): Promise<void> {
  // Clear local storage
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CODE_VERIFIER_KEY);
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(NONCE_KEY);

  // Optionally hit the logout endpoint
  if (hitLogoutEndpoint) {
    try {
      await fetch(import.meta.env.VITE_SHOPIFY_CUSTOMER_LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}