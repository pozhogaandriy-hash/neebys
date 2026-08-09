'use client';

export default function GlobalError() {
  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          color: '#171717',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main style={{ width: 343, textAlign: 'center' }}>
          <h1 style={{ fontSize: 18, fontWeight: 600 }}>
            Щось пішло не так
          </h1>
          <p style={{ color: '#737373', fontSize: 14, lineHeight: 1.5 }}>
            Сталася непередбачена помилка. Оновіть сторінку та спробуйте ще раз.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              minHeight: 40,
              padding: '8px 18px',
              borderRadius: 6,
              background: '#171717',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Оновити
          </button>
        </main>
      </body>
    </html>
  );
}
