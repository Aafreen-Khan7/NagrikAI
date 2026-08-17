type FirebaseAuthEnv = {
  apiKey?: string;
};

const readAuthEnv = (): FirebaseAuthEnv => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
});

const parseJson = async <T>(response: Response): Promise<T> => {
  const payload = await response.text();
  if (!response.ok) {
    throw new Error(payload || `Auth request failed with status ${response.status}`);
  }
  return JSON.parse(payload) as T;
};

const authEndpoint = (method: string) => {
  const { apiKey } = readAuthEnv();
  if (!apiKey) {
    throw new Error('Firebase API key is not configured.');
  }
  return `https://identitytoolkit.googleapis.com/v1/accounts:${method}?key=${apiKey}`;
};

export const isFirebaseAuthConfigured = () => Boolean(readAuthEnv().apiKey);

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  const response = await fetch(authEndpoint('signInWithPassword'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  return parseJson<{
    idToken: string;
    refreshToken: string;
    localId: string;
    email: string;
    expiresIn: string;
  }>(response);
};

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  const response = await fetch(authEndpoint('signUp'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  return parseJson<{
    idToken: string;
    refreshToken: string;
    localId: string;
    email: string;
    expiresIn: string;
  }>(response);
};

export const sendPasswordResetEmail = async (email: string) => {
  const response = await fetch(authEndpoint('sendOobCode'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestType: 'PASSWORD_RESET',
      email,
    }),
  });

  return parseJson<{ email: string }>(response);
};

const requestWithFallback = async (
  email: string,
  password: string,
) => {
  try {
    return await signInWithEmailAndPassword(email, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes('EMAIL_NOT_FOUND') ||
      message.includes('INVALID_LOGIN_CREDENTIALS') ||
      message.includes('INVALID_PASSWORD')
    ) {
      return signUpWithEmailAndPassword(email, password);
    }
    throw error;
  }
};

export const signInOrCreateWithEmailAndPassword = async (email: string, password: string) => {
  return requestWithFallback(email, password);
};
