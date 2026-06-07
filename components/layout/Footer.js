export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sage-dark text-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-3">
          <span className="font-heading text-2xl font-semibold">
            Lumera Wellness
          </span>
          <p className="max-w-md text-sm text-cream/80">
            Restorative massage &amp; mindful wellness, crafted for moments of
            calm.
          </p>
        </div>

        <div className="mt-10 border-t border-cream/20 pt-6 text-xs text-cream/70">
          &copy; {year} Lumera Wellness. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
