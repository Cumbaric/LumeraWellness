/**
 * Central services mock data for Lumera Wellness.
 *
 * This is the single source of truth for treatments while there is no
 * database yet. Components should read from here (or receive the data via
 * props) so the shape can later be swapped for a DB/API response without
 * touching the presentational layer.
 *
 * Service shape:
 *   {
 *     id, slug, name, category,
 *     shortDescription, longDescription,
 *     benefits: string[],
 *     durations: { minutes, price }[],   // price in EUR
 *     image,                             // Unsplash CDN url
 *     featured: boolean,
 *   }
 */

// Image params kept consistent across services for predictable optimization.
const IMG = "auto=format&fit=crop&w=1200&q=80";

export const categories = {
  relaxation: { label: "Relaxation" },
  therapeutic: { label: "Therapeutic" },
  body: { label: "Body Treatments" },
  couples: { label: "Couples & Special" },
};

export const services = [
  {
    id: "aromatherapy",
    slug: "aromatherapy-relaxation-massage",
    name: "Aromatherapy Relaxation Massage",
    category: "relaxation",
    shortDescription:
      "Gentle full-body massage with essential oils to melt away stress.",
    longDescription:
      "A soothing full-body treatment combining light-to-medium pressure with carefully chosen essential oils. Designed to calm the nervous system, ease tension, and restore a sense of balance.",
    benefits: [
      "Reduces stress and anxiety",
      "Improves sleep quality",
      "Boosts mood and relaxation",
    ],
    durations: [
      { minutes: 60, price: 45 },
      { minutes: 90, price: 60 },
    ],
    image: `https://images.unsplash.com/photo-1519823551278-64ac92734fb1?${IMG}`,
    featured: true,
  },
  {
    id: "swedish",
    slug: "swedish-full-body-massage",
    name: "Swedish Full-Body Massage",
    category: "relaxation",
    shortDescription: "The classic relaxing massage for overall well-being.",
    longDescription:
      "A timeless technique using long, flowing strokes to improve circulation, relieve muscle tension, and promote deep relaxation across the entire body.",
    benefits: [
      "Improves circulation",
      "Relieves general muscle tension",
      "Promotes deep relaxation",
    ],
    durations: [
      { minutes: 60, price: 40 },
      { minutes: 90, price: 55 },
    ],
    image: `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?${IMG}`,
    featured: true,
  },
  {
    id: "deep-tissue",
    slug: "deep-tissue-therapy",
    name: "Deep Tissue Therapy",
    category: "therapeutic",
    shortDescription: "Targeted deep pressure for chronic tension and knots.",
    longDescription:
      "A focused therapeutic massage targeting deeper muscle layers and connective tissue. Ideal for chronic tension, stubborn knots, and recovery from physical strain.",
    benefits: [
      "Releases chronic muscle tension",
      "Targets specific problem areas",
      "Aids physical recovery",
    ],
    durations: [
      { minutes: 60, price: 50 },
      { minutes: 90, price: 65 },
    ],
    image: `https://images.unsplash.com/photo-1515377905703-c4788e51af15?${IMG}`,
    featured: true,
  },
  {
    id: "sports",
    slug: "sports-recovery-massage",
    name: "Sports Recovery Massage",
    category: "therapeutic",
    shortDescription: "Performance-focused massage for active bodies.",
    longDescription:
      "A dynamic treatment combining deep pressure and stretching to support muscle recovery, reduce soreness, and improve flexibility for active lifestyles.",
    benefits: [
      "Speeds up muscle recovery",
      "Reduces post-workout soreness",
      "Improves flexibility",
    ],
    durations: [
      { minutes: 60, price: 50 },
      { minutes: 90, price: 65 },
    ],
    image: `https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?${IMG}`,
    featured: false,
  },
  {
    id: "hot-stone",
    slug: "hot-stone-ritual",
    name: "Hot Stone Ritual",
    category: "body",
    shortDescription: "Warm basalt stones for deep, comforting relaxation.",
    longDescription:
      "Heated basalt stones are placed and glided along the body to deliver deep warmth, ease muscle stiffness, and induce a profound state of calm.",
    benefits: [
      "Deeply relaxes muscles",
      "Improves circulation",
      "Soothes body and mind",
    ],
    durations: [{ minutes: 90, price: 70 }],
    image: `https://images.unsplash.com/photo-1610402601271-5b4bd5b3eba4?${IMG}`,
    featured: true,
  },
  {
    id: "body-scrub",
    slug: "body-scrub-hydration-wrap",
    name: "Body Scrub & Hydration Wrap",
    category: "body",
    shortDescription: "Exfoliating ritual leaving skin soft and renewed.",
    longDescription:
      "A two-step body ritual: a gentle exfoliating scrub followed by a nourishing hydration wrap, leaving the skin smooth, refreshed, and deeply hydrated.",
    benefits: [
      "Exfoliates and renews skin",
      "Deeply hydrates",
      "Leaves skin soft and glowing",
    ],
    durations: [{ minutes: 75, price: 60 }],
    image: `https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?${IMG}`,
    featured: false,
  },
  {
    id: "couples-ritual",
    slug: "couples-relaxation-ritual",
    name: "Couples Relaxation Ritual",
    category: "couples",
    shortDescription: "A shared relaxing massage experience for two.",
    longDescription:
      "Side-by-side relaxing massages in a private room, designed for couples or friends to unwind together in a calm, intimate setting.",
    benefits: [
      "Shared relaxing experience",
      "Private, intimate setting",
      "Perfect for special occasions",
    ],
    durations: [{ minutes: 90, price: 130 }],
    image: `https://images.unsplash.com/photo-1554424518-336ec861b705?${IMG}`,
    featured: true,
  },
  {
    id: "signature-escape",
    slug: "lumera-signature-escape",
    name: "Lumera Signature Escape",
    category: "couples",
    shortDescription: "Our premium full wellness journey.",
    longDescription:
      "Our signature experience: a full-body massage, hot stone therapy, and a hydration treatment combined into one indulgent journey of complete renewal.",
    benefits: [
      "Full multi-step wellness journey",
      "Premium signature experience",
      "Total body and mind renewal",
    ],
    durations: [{ minutes: 120, price: 150 }],
    image: `https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?${IMG}`,
    featured: false,
  },
];

/**
 * Returns the lowest price across a service's durations — used for the
 * "from €XX" label on cards.
 */
export function getStartingPrice(service) {
  return Math.min(...service.durations.map((d) => d.price));
}
