"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link'
import { useEffect, useState } from "react";
import Loader from "./components/loader"; 

export default function Home() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <main className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-500 ease-in-out transform">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Welcome
          </h1>
          {session && (
            <p className="mt-2 text-xl text-gray-600">
              {session.user?.name}
            </p>
          )}
        </div>

        {session && session.user?.image && (
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={session.user?.image}
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white shadow-lg transition-all duration-500 ease-in-out transform hover:scale-110"
              />
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col space-y-4 items-center justify-center min-h-[120px]">
            <Loader />
            <p className="text-blue-600 text-lg font-medium animate-pulse">Signing in, please wait...</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {session ? (
              <>
                <Link href="/profile" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center">
                  Edit Profile
                </Link>
                <button onClick={() => signOut()} className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out">
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
