import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiMe, apiSignIn, apiSignOut, apiSignUp } from "@/lib/authApi";
import AuthModal from "@/components/AuthModal";

interface User {
  id: string;
  name?: string;
  email?: string;
}

const useDbAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState<null | "signin" | "signup">(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    apiMe().then((data) => {
      setUser(data.user);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount, not on pathname change

  const signIn = useCallback(async (formData?: { email: string; password: string }) => {
    if (!formData) {
      setShowAuthModal("signin");
      return;
    }
    setLoading(true);
    try {
      const data = await apiSignIn(formData.email, formData.password);
      setUser(data.user);
      setShowAuthModal(null);
      // Do NOT redirect to dashboard after sign-in
      // router.push("/dashboard"); // Removed as per user request
    } catch (e) {
      alert("Sign in failed");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await apiSignOut();
      setUser(null);
      // Instead of reload, update the URL if needed
      // Optionally, trigger a router refresh if you want to re-run server components
      // router.refresh(); // Uncomment if using next/navigation's useRouter
    } catch (e) {
      alert("Sign out failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (formData?: { name: string; email: string; password: string }) => {
    if (!formData) {
      setShowAuthModal("signup");
      return;
    }
    setLoading(true);
    try {
      const data = await apiSignUp(formData.name, formData.email, formData.password);
      setUser(data.user);
      setShowAuthModal(null);
      // Redirect to dashboard after successful sign-up (optional, can remove if not desired)
      router.push("/dashboard");
    } catch (e) {
      alert("Sign up failed");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const isCurrentPathDashboard = pathname?.startsWith("/dashboard");
  const isCurrentPathHome = pathname === "/";

  return {
    isAuthenticated: !!user,
    user,
    loading,
    signIn,
    signOut,
    signUp,
    showAuthModal,
    setShowAuthModal,
    isCurrentPathDashboard,
    isCurrentPathHome,
    authModalProps: {
      show: !!showAuthModal,
      onClose: () => setShowAuthModal(null),
      mode: showAuthModal || "signin",
      loading,
      onSubmit: showAuthModal === "signin" ? signIn : signUp,
    },
  };
};

export default useDbAuth;
