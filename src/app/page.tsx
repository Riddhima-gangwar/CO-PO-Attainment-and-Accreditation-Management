import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically route root traffic to the main outcome dashboard
  redirect('/dashboard');
}
