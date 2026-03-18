"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export function FooterWithContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setStatus("error");
      setMessage("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          address: "Gallery enquiry",
          message: "Website gallery footer form submission.",
        }),
      });
      if (!res.ok) throw new Error("Unable to submit contact request.");
      setStatus("success");
      setMessage("Thanks. We will contact you shortly.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="mt-12 border-t border-[#d2d5c6] bg-[#02203D] text-[#fbf8e5]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2d5c6]">Contact</p>
          <h3 className="mt-2 text-3xl font-bold leading-tight">Ready to refresh your property?</h3>
          <p className="mt-3 max-w-md text-sm text-[#d2d5c6]">
            Tell us what you need cleaned and we will arrange a fast, tailored quote.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <p>
              Call:{" "}
              <Link className="font-semibold text-white hover:text-[#f0a935]" href={siteConfig.phoneHref}>
                {siteConfig.phoneDisplay}
              </Link>
            </p>
            <p>{siteConfig.hoursText}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-[#d2d5c6]/70 bg-white p-5 text-[#02203D]">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="First name"
              className="rounded-lg border border-[#d2d5c6] px-3 py-2 text-sm outline-none focus:border-[#055178]"
            />
            <input
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Last name"
              className="rounded-lg border border-[#d2d5c6] px-3 py-2 text-sm outline-none focus:border-[#055178]"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="rounded-lg border border-[#d2d5c6] px-3 py-2 text-sm outline-none focus:border-[#055178]"
            />
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone"
              className="rounded-lg border border-[#d2d5c6] px-3 py-2 text-sm outline-none focus:border-[#055178]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-full bg-[#f0a935] px-5 py-2.5 text-sm font-semibold text-[#02203D] transition hover:bg-[#dd982d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Send Request"}
          </button>
          {message && (
            <p className={`mt-3 text-sm ${status === "success" ? "text-emerald-700" : "text-rose-600"}`}>{message}</p>
          )}
        </form>
      </div>
    </footer>
  );
}
