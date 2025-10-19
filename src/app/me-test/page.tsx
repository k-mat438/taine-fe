'use client';

import { useState } from 'react';
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/nextjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function MeTestPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callMe = async () => {
    setError(null);
    setResult(null);
    try {
      const token = await getToken(); // Clerkのセッショントークン
      const res = await fetch(`${API_URL}/api/v1/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>/api/v1/me 動作テスト</h1>

      <div style={{ marginBottom: 12 }}>
        {isLoaded && isSignedIn ? (
          <>
            <UserButton />
            <p>
              Signed in as:{' '}
              {user?.primaryEmailAddress?.emailAddress ??
                user?.username ??
                user?.id}
            </p>
          </>
        ) : (
          <>
            <SignInButton />
            <p>未ログインです</p>
          </>
        )}
      </div>

      <button
        onClick={callMe}
        disabled={!isLoaded}
        style={{ padding: '8px 16px' }}
      >
        /api/v1/me を呼ぶ
      </button>

      <pre
        style={{
          marginTop: 16,
          background: '#111',
          color: '#0f0',
          padding: 12,
          borderRadius: 8,
        }}
      >
        {error
          ? `ERROR:\n${error}`
          : result
            ? JSON.stringify(result, null, 2)
            : '結果はここに表示されます'}
      </pre>
    </main>
  );
}
