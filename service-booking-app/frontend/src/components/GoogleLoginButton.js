import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

const GoogleLoginButton = ({ onCredential, disabled = false }) => {
  const buttonRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isConfigured = clientId && clientId !== 'your_google_oauth_client_id';

  useEffect(() => {
    if (!isConfigured || disabled) return;

    let mounted = true;

    loadGoogleScript()
      .then(() => {
        if (!mounted || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response.credential)
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: buttonRef.current.offsetWidth || 384
        });

        setIsReady(true);
      })
      .catch(() => {
        toast.error('Unable to load Google sign in');
      });

    return () => {
      mounted = false;
    };
  }, [clientId, disabled, isConfigured, onCredential]);

  if (!isConfigured) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-500 shadow-sm"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
        <p className="text-center text-xs text-amber-700">
          Google login needs a real OAuth Client ID in your env files.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div
        ref={buttonRef}
        className={`w-full overflow-hidden rounded-full ${disabled || !isReady ? 'opacity-60 pointer-events-none' : ''}`}
      />
    </div>
  );
};

export default GoogleLoginButton;
