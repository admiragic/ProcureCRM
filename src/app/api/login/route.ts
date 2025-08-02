
import {NextResponse} from 'next/server';
import {adminAuth} from '@/lib/firebase-admin';
import {signInWithEmailAndPassword, getAuth} from 'firebase/auth';
import {app} from '@/lib/firebase';

// This is a temporary solution to verify user's password.
// In a production environment, you should use a more secure way to handle passwords,
// such as storing hashed passwords and comparing them.
// We are using client SDK here on the server to verify password which is not ideal.
async function verifyUserPassword(email: string, password: string): Promise<void> {
  const clientAuth = getAuth(app);
  await signInWithEmailAndPassword(clientAuth, email, password);
}

export async function POST(request: Request) {
  try {
    const {email, password} = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {error: 'Email and password are required'},
        {status: 400}
      );
    }

    // Get user by email from Admin SDK
    const userRecord = await adminAuth.getUserByEmail(email);

    // Verify password using the workaround function
    await verifyUserPassword(email, password);

    // If password is correct, create a custom token
    const customToken = await adminAuth.createCustomToken(userRecord.uid);

    return NextResponse.json({token: customToken});
  } catch (error: any) {
    console.error('Login API error:', error);
    let errorMessage = 'Internal Server Error';
    let statusCode = 500;

    // Handle specific Firebase auth errors
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/wrong-password'
    ) {
      errorMessage = 'Invalid credentials.';
      statusCode = 401;
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many login attempts. Please try again later.';
      statusCode = 429;
    } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
        statusCode = 400;
    }

    return NextResponse.json({error: errorMessage}, {status: statusCode});
  }
}
