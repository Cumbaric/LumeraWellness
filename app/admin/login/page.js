import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login | Lumera Wellness",
  description: "Admin login for Lumera Wellness.",
};

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin/reservations");
  }

  return (
    <section className="min-h-[70vh] bg-cream px-6 py-20">
      <div className="mx-auto max-w-md rounded-[2rem] border border-sage/15 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage-dark">
          Lumera Admin
        </p>
        <h1 className="font-heading text-4xl text-charcoal">
          Admin login
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Sign in to manage bookings and client requests.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}