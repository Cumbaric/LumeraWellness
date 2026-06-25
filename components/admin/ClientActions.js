"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditClientModal from "./EditClientModal";
import { deleteAdminClient } from "@/app/admin/actions";

export default function ClientActions({ manualRecord, bookingClient }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // client passed to the modal — either the existing record or a pre-filled shell from booking data
  const clientForModal = manualRecord ?? {
    id: null,
    guest_name: bookingClient?.name || "",
    guest_email: bookingClient?.email || "",
    guest_phone: bookingClient?.phone || "",
    notes: "",
  };

  async function handleDelete() {
    if (!manualRecord?.id) return;
    if (!confirm(`Delete contact record for "${manualRecord.guest_name}"? Booking history is not affected.`)) return;
    setDeleting(true);
    const result = await deleteAdminClient(manualRecord.id).catch(() => null);
    if (result?.ok) {
      router.push("/admin/clients");
    } else {
      alert(result?.error || "Failed to delete client.");
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="rounded-full border border-sage/20 bg-white px-5 py-2 text-sm font-semibold text-charcoal transition hover:bg-sand"
        >
          {manualRecord ? "Edit contact" : "Save as contact"}
        </button>

        {manualRecord && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full border border-clay/20 bg-white px-5 py-2 text-sm font-semibold text-clay transition hover:bg-clay/10 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete contact"}
          </button>
        )}
      </div>

      {editOpen && (
        <EditClientModal
          client={clientForModal}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
