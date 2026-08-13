'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage(
      'Реєстрацію створено. Перевір свою електронну пошту та підтвердь email.'
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#000',
        color: '#fff',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          Create account
        </h1>

        <p
          style={{
            color: '#999',
            marginBottom: '32px',
          }}
        >
          Join Gymfriends
        </p>

        <form onSubmit={handleRegister}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#111',
              color: '#fff',
            }}
          />

          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#111',
              color: '#fff',
            }}
          />

          {error && (
            <p style={{ color: '#ff6b6b', marginBottom: '16px' }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: '#7ee787', marginBottom: '16px' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 0,
              borderRadius: '8px',
              background: '#fff',
              color: '#000',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </main>
  )
}