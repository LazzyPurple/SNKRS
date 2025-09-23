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
 * Generate SHA256 hash and base64url encode
 */
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Start the OAuth login flow
 * Generates PKCE parameters and redirects to Shopify authorization endpoint
 */
export async function startLogin(): Promise<void> {
  // Generate PKCE parameters
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await sha256(codeVerifier);
  const state = generateRandomString(32);
  const nonce = generateRandomString(32);

  // Store PKCE parameters for later use
  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
  localStorage.setItem(STATE_KEY, state);
  localStorage.setItem(NONCE_KEY, nonce);

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_SHOPIFY_CUSTOMER_APP_ID,
    redirect_uri: import.meta.env.VITE_SHOPIFY_CUSTOMER_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email https://api.shopifyapis.com/auth/customer.graphql',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
    nonce,
  });

  const authorizeUrl = `${import.meta.env.VITE_SHOPIFY_CUSTOMER_AUTH_URL}?${params.toString()}`;
  
  // Redirect to Shopify authorization endpoint
  window.location.href = authorizeUrl;
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
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(import.meta.env.VITE_SHOPIFY_CUSTOMER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: import.meta.env.VITE_SHOPIFY_CUSTOMER_APP_ID,
        code,
        redirect_uri: import.meta.env.VITE_SHOPIFY_CUSTOMER_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
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