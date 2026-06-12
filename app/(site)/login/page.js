import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
  description: "Sign in to your Lumera Wellness account.",
};

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/booking");
  }

  return (
    <section className="bg-cream px-6 py-20">
      <div className="mx-auto max-w-md rounded-[2rem] border border-sage/15 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage-dark">
          Welcome back
        </p>
        <h1 className="font-heading text-4xl text-charcoal">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Access your Lumera Wellness account and manage your bookings.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}