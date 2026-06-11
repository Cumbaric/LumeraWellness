export const metadata = {
  title: {
    default: "Lumera Admin",
    template: "%s | Lumera Admin",
  },
  description: "Admin dashboard for Lumera Wellness.",
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-cream">{children}</div>;
}