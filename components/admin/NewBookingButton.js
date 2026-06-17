"use client";

/**
 * NewBookingButton — a trigger that opens the manual booking modal.
 *
 * Each instance owns its own open/close state and renders the modal only when
 * open, so multiple triggers on the same page work independently without any
 * shared context.
 *
 * Props:
 *   services   Array passed straight through to the modal.
 *   className  Styling for the trigger button (so it can match its location).
 *   label      Button text (default "New booking").
 */
import { useState } from "react";
import NewBookingModal from "./NewBookingModal";

export default function NewBookingButton({
  services,
  className,
  label = "New booking",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {label}
      </button>

      {isOpen && (
        <NewBookingModal services={services} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
