"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setStatus({
        type: "error",
        message: "Invalid email or password.",
      });
      setIsSubmitting(false);
      return;
    }

    setStatus({
      type: "success",
      message: "Login successful. Redirecting...",
    });

    router.push("/admin/reservations");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition focus:border-sage"
          placeholder="admin@lumerawellness.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Password
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition focus:border-sage"
          placeholder="••••••••"
        />
      </div>

      {status.message ? (
        <p
          className={`text-sm ${
            status.type === "error" ? "text-red-600" : "text-sage-dark"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}