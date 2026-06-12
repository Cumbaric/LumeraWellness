"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    if (password.length < 6) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (error) {
      setStatus({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      setStatus({
        type: "success",
        message: "Account created. Redirecting...",
      });

      router.push("/booking");
      router.refresh();
      return;
    }

    setStatus({
      type: "success",
      message:
        "Account created. Please check your email to confirm your registration.",
    });

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Full name
        </label>
        <input
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition focus:border-sage"
          placeholder="Your full name"
        />
      </div>

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
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Phone
        </label>
        <input
          type="tel"
          required
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition focus:border-sage"
          placeholder="+381 ..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition focus:border-sage"
          placeholder="Minimum 6 characters"
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
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-sage-dark">
          Sign in
        </Link>
      </p>
    </form>
  );
}
