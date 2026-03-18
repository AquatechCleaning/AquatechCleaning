"use client";

import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-[#d2d5c6] bg-white p-8 text-center shadow-[0_14px_34px_rgba(2,32,61,0.12)]">
        <h1 className="text-2xl font-semibold text-[#02203D]">Admin access is open</h1>
        <p className="text-sm leading-6 text-slate-600">
          Authentication is temporarily disabled. Continue directly to the admin dashboard.
        </p>
        <Link
          href="/admin/dashboard"
          className="ui-btn ui-btn-secondary w-full"
        >
          Go to admin dashboard
        </Link>
      </div>
    </div>
  );
}
