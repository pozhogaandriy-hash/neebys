import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Не авторизований
  if (!user) {
    redirect('/auth/sign-in');
  }

  const role = user.app_metadata?.role;

  // Не адміністратор
  if (role !== 'admin' && role !== 'super_admin') {
    redirect('/account/profile');
  }

  return user;
}