/**
 * /auth/sign-up — redirects to the single-page auth screen at /auth/sign-in.
 * Both Sign In and Create Account now live on /auth/sign-in.
 */
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  redirect('/auth/sign-in');
}
