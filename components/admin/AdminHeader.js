import Link from "next/link";
import { signOutAdmin } from "@/app/admin/actions";

function getNavLinkClass(isActive) {
  const baseClass =
    "rounded-full px-5 py-2 text-sm font-medium transition";

  if (isActive) {
    return `${baseClass} bg-charcoal text-white hover:bg-sage-dark`;
  }

  return `${baseClass} bg-sand text-charcoal hover:bg-sage/20`;
}

export default function AdminHeader({ userEmail, activePage }) {
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
            <p className="mt-1 text-sm text-muted">Signed in as {userEmail}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin"
            className={getNavLinkClass(activePage === "dashboard")}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/reservations"
            className={getNavLinkClass(activePage === "reservations")}
          >
            Reservations
          </Link>

          <Link
            href="/admin/clients"
            className={getNavLinkClass(activePage === "clients")}
          >
            Clients
          </Link>

          <form action={signOutAdmin}>
            <button
              type="submit"
              className="rounded-full bg-clay px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
