// Demo page — redirected to sign-in since AuthModeSwitch now requires props
import { redirect } from 'next/navigation';

export default function Demo() {
  redirect('/auth/sign-in');
}
