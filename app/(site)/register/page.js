import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register",
  description: "Create your Lumera Wellness account.",
};

export default async function RegisterPage() {
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
          Join Lumera
        </p>
        <h1 className="font-heading text-4xl text-charcoal">
          Create account
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Register to make future bookings faster and keep your wellness visits
          organized.
        </p>

        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}