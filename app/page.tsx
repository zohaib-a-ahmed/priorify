'use client'
import { useEffect } from 'react';
import { supabase } from '../app/supabase/client';
import { useRouter } from 'next/navigation';

export default function Index() {

  const router = useRouter();

  async function handleSignInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) console.error('Error signing in:', error);
  }

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.data.user?.aud) router.push('/home')
    })
  }, [])

  return (
    <>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-10 bg-white rounded shadow-lg">
        <div className="flex flex-col gap-4">
          <button
            onClick={handleSignInWithGoogle}
            className="px-6 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
