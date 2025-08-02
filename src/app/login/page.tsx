
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import Logo from '@/components/logo';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function LoginPage() {
  const [email, setEmail] = useState('zoran@temporis.hr');
  const [password, setPassword] = useState('shaban$$');
  const [error, setError] = useState('');
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);


  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Logic is moved back here from the API route for a standard client-side flow
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in AuthProvider will handle setting the user state
      // and the useEffect above will handle redirection.
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
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

  // Show a loading state while checking auth status
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
                placeholder="zoran@temporis.hr"
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
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? t('login_page.loading') : t('login_page.login_button')}
            </Button>
            <div className="mt-4 flex justify-center">
                <LanguageSwitcher />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
