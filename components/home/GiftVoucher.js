import Link from "next/link";

export default function GiftVoucher() {
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="overflow-hidden rounded-2xl border-2 border-gold bg-cream shadow-md">
          <div className="grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            {/* Left: offer copy */}
            <div>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
                New Client Gift
              </span>
              <h3 className="mt-4 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
                €10 off your first treatment
              </h3>
              <p className="mt-4 text-muted">
                A little welcome from us — enjoy a special gift on your first
                visit to Lumera.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-sage px-8 py-3 text-base font-medium text-cream transition-colors hover:bg-sage-dark"
              >
                Claim your gift
              </Link>
            </div>

            {/* Right: decorative voucher visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border-2 border-dashed border-gold/70 bg-sand/60 px-8 py-10 text-center">
                <span className="font-heading text-2xl font-semibold tracking-wide text-charcoal">
                  Lumera Gift
                </span>
                <span className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">
                  Welcome Voucher
                </span>
                <span className="mt-6 rounded-full bg-gold/15 px-6 py-2 font-body text-sm font-semibold uppercase tracking-[0.25em] text-clay ring-1 ring-gold/40">
                  WELCOME10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
