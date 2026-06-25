"use client";

import { useState } from "react";
import NewClientModal from "./NewClientModal";

export default function NewClientButton({ className }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-dark"
        }
      >
        + New client
      </button>

      {open ? <NewClientModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
