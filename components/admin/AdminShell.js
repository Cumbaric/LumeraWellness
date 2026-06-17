import Link from "next/link";
import { signOutAdmin } from "@/app/admin/actions";

const navItems = [
  { label: "Dashboard", href: "/admin", key: "dashboard" },
  { label: "Reservations", href: "/admin/reservations", key: "reservations" },
  { label: "Clients", href: "/admin/clients", key: "clients" },
];

function getNavClass(isActive) {
  const baseClass =
    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition";

  if (isActive) {
    return `${baseClass} bg-charcoal text-white shadow-sm`;
  }

  return `${baseClass} text-muted hover:bg-sand/70 hover:text-charcoal`;
}

export default function AdminShell({
  activePage,
  children,
  title,
  userEmail,
  headerAction,
}) {
  return (
    <section className="min-h-screen bg-cream lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-sage/15 bg-white px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link href="/admin" className="block">
            <p className="text-xs uppercase tracking-[0.32em] text-sage-dark">
              Lumera
            </p>
            <h1 className="mt-1 font-heading text-3xl text-charcoal">Admin</h1>
          </Link>

          <form action={signOutAdmin} className="lg:hidden">
            <button
              type="submit"
              className="rounded-full bg-clay px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Logout
            </button>
          </form>
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={getNavClass(activePage === item.key)}
            >
              <span>{item.label}</span>
              {activePage === item.key ? <span aria-hidden="true">/</span> : null}
            </Link>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-2xl bg-cream p-4 ring-1 ring-sage/10 lg:block">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Signed in
          </p>
          <p className="mt-2 break-all text-sm font-medium text-charcoal">
            {userEmail}
          </p>
        </div>

        <form action={signOutAdmin} className="mt-4 hidden lg:block">
          <button
            type="submit"
            className="w-full rounded-xl bg-clay px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Logout
          </button>
        </form>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-sage/15 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-sage-dark">
                Lumera Admin
              </p>
              <h2 className="mt-2 font-heading text-4xl text-charcoal">
                {title}
              </h2>
            </div>
            {headerAction ?? (
              <Link
                href="/booking"
                className="w-fit rounded-full border border-sage/20 bg-white px-5 py-3 text-sm font-semibold text-charcoal shadow-sm transition hover:bg-sand"
              >
                New booking
              </Link>
            )}
          </div>

          {children}
        </div>
      </main>
    </section>
  );
}
