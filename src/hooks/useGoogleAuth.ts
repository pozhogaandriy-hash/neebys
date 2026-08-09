'use client';

/**
 * useGoogleAuth — Google OAuth 2.0 popup sign-in (frontend-only).
 *
 * Strategy: OAuth 2.0 implicit flow via a browser popup window.
 *   1. Open accounts.google.com/o/oauth2/v2/auth in a popup.
 *   2. User picks their Google account and consents.
 *   3. Google redirects the popup to our /auth/google/callback page with
 *      an access_token in the URL hash.
 *   4. The callback page reads the token and postMessages it to the opener.
 *   5. We call https://www.googleapis.com/oauth2/v3/userinfo with the token
 *      to get the user's real name, email, and avatar.
 *   6. The profile is passed to the caller — no client secret anywhere.
 *
 * Limitation: The implicit flow access token is short-lived and no refresh
 * token is issued. This is truthful frontend-only auth — real Google identity,
 * no server-side session. JWT signature is NOT verified server-side.
 *
 * No client secret is used or referenced in this file or in the browser.
 */

const GOOGLE_CLIENT_ID =
  '663833609-nd0ljsi0dh9t111sstij1tepl5se4snm.apps.googleusercontent.com';

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}

type GoogleCallback = (profile: GoogleProfile) => void;
type ErrorCallback = (reason: string) => void;

/**
 * Build the Google OAuth 2.0 authorization URL.
 * Uses response_type=token (implicit) so the access token arrives in the
 * redirect hash — no server exchange required.
 */
function buildAuthUrl(): string {
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'openid email profile',
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Open the Google sign-in popup and resolve with a GoogleProfile on success.
 * The popup navigates to /auth/google/callback which postMessages the token back.
 */
export function triggerGoogleSignIn(
  onSuccess: GoogleCallback,
  onError: ErrorCallback,
): void {
  const width = 500;
  const height = 600;
  const left = Math.max(0, (window.screen.width - width) / 2);
  const top = Math.max(0, (window.screen.height - height) / 2);

  const popup = window.open(
    buildAuthUrl(),
    'google-signin',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
  );

  if (!popup) {
    onError(
      'Popup was blocked. Please allow popups for this site and try again.',
    );
    return;
  }

  // Listen for the postMessage from /auth/google/callback
  const handler = async (event: MessageEvent) => {
    // Only accept messages from our own origin
    if (event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== 'GOOGLE_AUTH_TOKEN') return;

    window.removeEventListener('message', handler);
    clearInterval(pollTimer);

    const token: string | undefined = event.data.token;
    if (!token) {
      onError(event.data.error || 'Google sign-in was cancelled or failed.');
      return;
    }

    // Exchange the access token for profile info via Google's userinfo endpoint
    try {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(`userinfo ${res.status}`);
      const data = await res.json() as {
        sub: string;
        email: string;
        name: string;
        picture?: string;
        email_verified?: boolean;
      };
      onSuccess({
        sub: data.sub,
        email: data.email,
        name: data.name,
        picture: data.picture,
        email_verified: data.email_verified,
      });
    } catch {
      onError('Could not fetch your Google profile. Please try again.');
    }
  };

  window.addEventListener('message', handler);

  // Poll to detect if the user closed the popup manually
  const pollTimer = setInterval(() => {
    if (popup.closed) {
      clearInterval(pollTimer);
      window.removeEventListener('message', handler);
      onError('Google sign-in was closed before completing.');
    }
  }, 500);
}
