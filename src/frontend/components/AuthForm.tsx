import { useState } from "react";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: { name?: string; email: string; password: string }) => void;
  loading?: boolean;
}

export default function AuthForm({ mode, onSubmit, loading }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-white rounded shadow w-80 mx-auto">
      {mode === "signup" && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Loading..." : mode === "signup" ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
}
