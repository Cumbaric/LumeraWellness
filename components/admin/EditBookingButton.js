"use client";

import { useState } from "react";
import EditBookingModal from "./EditBookingModal";

export default function EditBookingButton({ booking, services, className }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "rounded-full border border-sage/20 px-4 py-1.5 text-xs font-semibold text-charcoal transition hover:bg-sand"
        }
      >
        Edit
      </button>

      {open ? (
        <EditBookingModal
          booking={booking}
          services={services}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
