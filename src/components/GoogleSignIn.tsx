'use client';

import { useEffect, useRef, useCallback } from 'react';

interface GoogleSignInProps {
  onSuccess: (user: { id: string; email: string; name: string }) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleSignIn({ onSuccess, onError }: GoogleSignInProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        onSuccess(data.data);
      } else {
        onError?.(data.error || 'Google sign-in failed');
      }
    } catch {
      onError?.('Network error during Google sign-in');
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!clientId) return;

    const loadGSI = () => {
      if (window.google?.accounts?.id && btnRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          itp_support: true,
        });
        window.google.accounts.id.renderButton(btnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: 320,
          logo_alignment: 'left',
        });
      }
    };

    if (window.google?.accounts?.id) {
      loadGSI();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = loadGSI;
      document.head.appendChild(script);
    }
  }, [clientId, handleCredentialResponse]);

  if (!clientId) return null;

  return (
    <div className="flex justify-center">
      <div ref={btnRef} />
    </div>
  );
}
