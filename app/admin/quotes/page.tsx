async function getQuotes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/quotes`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function QuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Quotes</h1>
        <p className="text-sm text-slate-600">Manage inbound self-serve quotes.</p>
      </div>
      <div className="overflow-hidden ui-card">
        <table className="ui-table min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Total</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.map((quote: any) => (
              <tr key={quote._id}>
                <td className="px-4 py-3">{quote.customerId}</td>
                <td className="px-4 py-3">R{quote.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-[#d2d5c6] bg-[#f8fafc] px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                    {quote.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : ""}
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={4}>
                  No quotes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

