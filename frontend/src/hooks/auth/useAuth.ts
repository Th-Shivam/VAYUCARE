import { useState } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/clerk-react";
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";

export function useAuth() {
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Helper to extract user-friendly error messages from Clerk errors
  const handleAuthError = (err: any) => {
    console.error(err);
    if (isClerkAPIResponseError(err)) {
      err.errors.forEach((e: any) => console.error(e.longMessage));
      if (err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected authentication error occurred.");
      }
    } else if (err && err.message) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSignInLoaded) {
      setError("Sign-in service is not ready yet. Please try again.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        return true;
      } else {
        setError(`Sign-in status incomplete: ${result.status}. Additional steps may be required.`);
        return false;
      }
    } catch (err: any) {
      handleAuthError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    if (!isSignUpLoaded) {
      setError("Sign-up service is not ready yet. Please try again.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      return true;
    } catch (err: any) {
      handleAuthError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async (code: string) => {
    if (!isSignUpLoaded) {
      setError("Sign-up service is not ready yet. Please try again.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        return true;
      } else {
        setError(`Verification incomplete. Status: ${result.status}`);
        return false;
      }
    } catch (err: any) {
      handleAuthError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
      return true;
    } catch (err: any) {
      handleAuthError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithEmail,
    signUpWithEmail,
    verifyEmailCode,
    logout,
    loading,
    error,
    clearError,
  };
}
