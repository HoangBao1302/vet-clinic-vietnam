'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  siteKey: string;
}

export interface ReCaptchaRef {
  execute: () => Promise<void>;
}

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
  ({ onVerify, onError, siteKey }, ref) => {
    const loaded = useRef(false);
    const loading = useRef(false);

    useEffect(() => {
      if (loaded.current || !siteKey) return;

      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="recaptcha"]`);
      if (existingScript) {
        loaded.current = true;
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        loaded.current = true;
        loading.current = false;
      };

      script.onerror = () => {
        loading.current = false;
        if (onError) {
          onError('Failed to load reCAPTCHA script');
        }
      };

      loading.current = true;
      document.head.appendChild(script);
    }, [siteKey, onError]);

    const executeRecaptcha = async () => {
      if (!siteKey) {
        if (onError) {
          onError('reCAPTCHA site key is not configured');
        }
        return;
      }

      // Wait for script to load
      let attempts = 0;
      while (!loaded.current && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.grecaptcha || !window.grecaptcha.ready) {
        if (onError) {
          onError('reCAPTCHA is not ready. Please refresh the page.');
        }
        return;
      }

      try {
        const token = await window.grecaptcha.execute(siteKey, { action: 'submit' });
        onVerify(token);
      } catch (error: any) {
        if (onError) {
          onError(error.message || 'reCAPTCHA verification failed');
        }
      }
    };

    useImperativeHandle(ref, () => ({
      execute: executeRecaptcha,
    }));

    return null; // Invisible - no UI
  }
);

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;

