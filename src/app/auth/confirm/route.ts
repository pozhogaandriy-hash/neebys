import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/account'
  redirectUrl.search = ''

  if (!tokenHash || !type) {
    redirectUrl.pathname = '/auth/error'
    return NextResponse.redirect(redirectUrl)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error) {
    redirectUrl.pathname = '/auth/error'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(redirectUrl)
}