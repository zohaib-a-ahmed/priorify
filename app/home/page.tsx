'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useRouter } from 'next/navigation';

export default function Home() {

  const [accessToken, setAccessToken] = useState<string>();
  const router = useRouter()

  useEffect(() => {
    // Check if current user is still authenticated and redirect to login if necessary
    supabase.auth.getUser().then((response) => {
        if (!response.data.user?.aud) router.push('/')
      })
    // If authenticated, retrieve access token
    supabase.auth.getSession().then((response) => setAccessToken(response.data.session?.access_token))
  }, [])

  // Function to handle sign-out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    else router.push('/')
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Productivity App Dashboard</h1>
        {accessToken ? (
          <>
            <div className="text-left p-4 bg-gray-200 rounded-lg">
              <strong>Access Token:</strong> <span className="break-all">{accessToken}</span>
            </div>
            <button
              onClick={signOut}
              className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
            <div className="mt-6 text-md text-gray-700">
              <p>So far, the frontend has successfully integrated Supabase authentication with Google. The user flow to the home page is secure, and we've retrieved the Supabase access token.</p>
              <p className="mt-2">Next, we'll focus on the backend, working with calendars and reminders. Once the backend and API are ready, we'll return to the frontend to create an interactive interface for managing the calendar and reminders.</p>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-700">Please sign in.</p>
        )}
      </div>
    </div>
  );
  
}
