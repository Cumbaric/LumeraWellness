import Link from "next/link";
import { signOutAdmin } from "@/app/admin/actions";

export default function AdminHeader({ userEmail }) {
  return (
    <div className="mb-10 rounded-[2rem] border border-sage/15 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sage-dark">
            Lumera Admin
          </p>
          <h2 className="mt-2 font-heading text-3xl text-charcoal">
            Admin Dashboard
          </h2>
          {userEmail ? (
            <p className="mt-1 text-sm text-muted">
              Signed in as {userEmail}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/reservations"
            className="rounded-full bg-sand px-5 py-2 text-sm font-medium text-charcoal transition hover:bg-sage/20"
          >
            Reservations
          </Link>

          <form action={signOutAdmin}>
            <button
              type="submit"
              className="rounded-full bg-charcoal px-5 py-2 text-sm font-semibold text-white transition hover:bg-sage-dark"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}