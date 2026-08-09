'use client';

import { useEffect } from 'react';

/**
 * /auth/google/callback
 *
 * This page is the OAuth 2.0 redirect target for the Google sign-in popup.
 * Google appends the access_token (or error) in the URL hash after the user
 * consents. This page reads it and postMessages it back to the opener window,
 * then closes itself.
 *
 * No secret is used or needed here. The page is intentionally minimal —
 * it exists only to relay the token from the popup back to the main window.
 */
export default function GoogleCallbackPage() {
  useEffect(() => {
    // Parse the URL hash: #access_token=...&token_type=Bearer&...
    const hash = window.location.hash.slice(1); // strip leading '#'
    const params = new URLSearchParams(hash);

    const token = params.get('access_token');
    const error = params.get('error');

    if (window.opener && typeof window.opener.postMessage === 'function') {
      if (token) {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_TOKEN', token },
          window.location.origin,
        );
      } else {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_TOKEN',
            token: null,
            error: error ?? 'Google sign-in did not return a token.',
          },
          window.location.origin,
        );
      }
    }

    // Close the popup — the opener handles everything from here
    window.close();
  }, []);

  // Briefly visible while the popup is closing
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#555',
        background: '#fff',
      }}
    >
      Completing sign-in…
    </div>
  );
}
