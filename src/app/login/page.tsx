
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import Logo from '@/components/logo';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function LoginPage() {
  const [email, setEmail] = useState('zoran@temporis.hr');
  const [password, setPassword] = useState('shaban$$');
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);


  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred.');
        return;
      }

      await signInWithCustomToken(auth, data.token);
      // onAuthStateChanged in AuthProvider will handle the rest
    } catch (err: any) {
      console.error(err);
      setError('Failed to log in. Please check the console.');
    }
  };

  // Show a loading state while checking auth status
  if (loading || user) {
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
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              {t('login_page.login_button')}
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
