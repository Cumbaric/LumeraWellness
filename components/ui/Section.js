/**
 * Section — the single source of truth for vertical section spacing. Applies a
 * consistent vertical rhythm across pages. Controls vertical spacing only;
 * width/horizontal padding is handled by <Container>, usually nested inside.
 *
 * Full-bleed sections (dark "Why Lumera", blush bands) can pass a background
 * via className and place a <Container> inside for their inner content.
 *
 * Props:
 *   - children
 *   - className?: string          merged onto the base classes
 *   - as?: ElementType            defaults to 'section'
 */
export default function Section({ children, className = "", as: Tag = "section" }) {
  return <Tag className={`py-16 sm:py-20 lg:py-24 ${className}`}>{children}</Tag>;
}
