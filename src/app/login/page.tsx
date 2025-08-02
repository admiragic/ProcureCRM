
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

export default function LoginPage() {
  const [email, setEmail] = useState('zoran@temporis.hr');
  const [password, setPassword] = useState('shaban$$');
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);


  const handleLogin = async () => {
    setError('');
    try {
      // Logic is moved here from the context
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in AuthProvider will handle setting the user state
      // and the useEffect above will handle redirection.
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email') {
        setError('Neispravan email ili lozinka.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Problem s konfiguracijom Firebasea. Molimo provjerite `src/lib/firebase.ts`.');
      } else {
        setError('Došlo je do pogreške prilikom prijave.');
      }
      console.error(err);
    }
  };

  // Show a loading state while checking auth status
  if (loading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            Učitavanje...
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
          <CardTitle className="text-2xl">Prijava</CardTitle>
          <CardDescription>Unesite svoj email i lozinku za pristup.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Lozinka</Label>
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
              Prijavi se
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
