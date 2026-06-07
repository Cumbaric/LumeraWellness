/**
 * Container — the single source of truth for content max width and horizontal
 * padding. Centers its children at a standard width with consistent gutters.
 *
 * Usually composed with <Section> for vertical rhythm:
 *   <Section><Container>…</Container></Section>
 *
 * Props:
 *   - children
 *   - className?: string   merged onto the base classes
 */
export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
