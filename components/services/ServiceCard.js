import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getStartingPrice } from "@/data/services";

/**
 * Presentational card for a single service. Reused on the Home page and,
 * later, the Services listing page. Receives a service object via props.
 */
export default function ServiceCard({ service }) {
  const startingPrice = getStartingPrice(service);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-cream shadow-sm ring-1 ring-sand transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-semibold text-charcoal">
          {service.name}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted">
          {service.shortDescription}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-charcoal">
            from{" "}
            <span className="font-medium text-sage-dark">
              {formatPrice(startingPrice)}
            </span>
          </span>
          <Link
            href={`/services/${service.slug}`}
            className="text-sm font-medium text-sage transition-colors hover:text-sage-dark"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </article>
  );
}
