
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import Logo from '@/components/logo';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';

/**
 * The login page component.
 * It handles user authentication, displays a login form, and manages loading and error states.
 * @returns {React.ReactElement} The rendered login page.
 */
export default function LoginPage() {
  // State for form inputs, error messages, and loading status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const { t } = useLanguage();

  /**
   * Effect to redirect the user to the dashboard if they are already logged in.
   * This runs whenever the user or authLoading state changes.
   */
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);


  /**
   * Handles the login form submission.
   * It calls the `login` function from the AuthContext and handles potential errors.
   */
  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // After successful login, the onAuthStateChanged listener in AuthProvider
      // will update the user state, and the useEffect above will handle redirection.
    } catch (err: any) {
      console.error("Login failed:", err);
      // Provide user-friendly error messages based on the Firebase error code
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError(t('login_page.error_invalid_credentials'));
      } else if (err.code === 'auth/configuration-not-found') {
        setError(t('login_page.error_config_problem'));
      }
      else {
        setError(t('login_page.error_generic'));
      }
    } finally {
        setIsLoading(false);
    }
  };

  /**
   * Shows a loading screen while the authentication status is being checked
   * or if the user is already logged in and waiting for redirection.
   */
  if (authLoading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            {t('login_page.loading')}
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
          <CardTitle className="text-2xl">{t('login_page.title')}</CardTitle>
          <CardDescription>{t('login_page.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('login_page.email_label')}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('login_page.password_label')}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {/* Display error message if login fails */}
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? t('login_page.loading') : t('login_page.login_button')}
            </Button>
            {/* Language switcher component */}
            <div className="mt-4 flex justify-center">
                <LanguageSwitcher />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
