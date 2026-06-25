"use client";

import { useState } from "react";
import ServiceCard from "./ServiceCard";

export default function ServicesGrid({ services, categories }) {
  const [active, setActive] = useState("all");

  const tabs = [
    { key: "all", label: "All" },
    ...Object.entries(categories).map(([key, cat]) => ({
      key,
      label: cat.label,
    })),
  ];

  const visible =
    active === "all"
      ? services
      : services.filter((s) => s.category === active);

  const grouped =
    active === "all"
      ? Object.entries(categories)
          .map(([key, cat]) => ({
            key,
            label: cat.label,
            items: services.filter((s) => s.category === key),
          }))
          .filter((g) => g.items.length > 0)
      : null;

  return (
    <>
      {/* Filter tabs */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={[
              "rounded-full px-5 py-2 text-sm font-medium transition",
              active === tab.key
                ? "bg-sage text-cream shadow-sm"
                : "border border-sage/20 text-charcoal hover:bg-sand",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grouped by category (All view) */}
      {grouped
        ? grouped.map((group) => (
            <section key={group.key} className="mb-16 last:mb-0">
              <h2 className="text-center font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                {group.label}
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-6">
                {group.items.map((service) => (
                  <div
                    key={service.id}
                    className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            </section>
          ))
        : /* Flat grid for single category */
          <div className="flex flex-wrap justify-center gap-6">
            {visible.map((service) => (
              <div
                key={service.id}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>}
    </>
  );
}
