import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthTokens, isAuthenticated } from '../utils/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if already authenticated
    if (isAuthenticated()) {
      navigate('/twitter-logs');
      return;
    }

    // Get authorization code from URL
    const code = searchParams.get('code');
    
    if (code) {
      // Exchange code for token (you'll need a backend endpoint for this)
      exchangeCodeForToken(code);
    } else {
      // No code provided, show login UI or redirect
      showLoginUI();
    }
  }, [searchParams, navigate]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      // TODO: Replace with your backend endpoint that exchanges the code for tokens
      // This endpoint should handle the OpenID Connect token exchange
      const response = await fetch('https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      
      // Store tokens
      setAuthTokens(data.access_token, data.refresh_token, data.expires_in);

        // Navigate to the protected route after successful login
        navigate('/twitter-logs');

    } catch (error) {
      console.error('Login error:', error);
      showLoginUI();
    }
  };

  const showLoginUI = () => {
    // This component is shown while waiting for authentication
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center dark:bg-gray-900 dark:text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Login...</h1>
        <p className="text-muted-foreground">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
};

export default Login;
