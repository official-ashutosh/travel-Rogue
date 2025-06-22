// This is a utility to call the /api/auth endpoints from the frontend
export async function apiSignIn(email: string, password: string) {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Sign in failed");
  return res.json();
}

export async function apiSignOut() {
  const res = await fetch("/api/auth/signout", { method: "POST" });
  if (!res.ok) throw new Error("Sign out failed");
  return res.json();
}

export async function apiMe() {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return { user: null };
  return res.json();
}

export async function apiSignUp(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Sign up failed");
  return res.json();
}
