export default function EvidenceLog() {
  const categories = 'Weapon / Document / Digital / Forensic / Chemical / Personal / Other';
  const conditions = 'Intact / Damaged / Partial / Contaminated';
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <main
      className="max-w-[11in] mx-auto px-6 py-4 text-black bg-white print:p-0 print-landscape"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-gray-900 text-white px-6 py-3 mb-4 avoid-break">
        <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-0.5">
          Property of Crime Lab — Do Not Distribute
        </p>
        <h1 className="text-xl font-bold uppercase tracking-widest">
          Evidence Intake Log — Chain of Custody Record
        </h1>
        <p className="text-gray-400 text-xs mt-0.5 tracking-wider uppercase">
          Maintain with case file at all times
        </p>
      </header>

      {/* ── Case Info ──────────────────────────────────────── */}
      <section className="border border-black p-3 mb-4 avoid-break">
        <div className="grid grid-cols-3 gap-6">
          <Field label="Case Number" />
          <Field label="Date Opened" />
          <Field label="Lead Investigator" />
        </div>
      </section>

      {/* ── Evidence Table ─────────────────────────────────── */}
      <section className="border border-black mb-4 avoid-break overflow-x-auto">
        <div className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
          Evidence Items
        </div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <Th className="w-8 text-center">#</Th>
              <Th className="min-w-[140px]">Evidence Description</Th>
              <Th className="min-w-[90px]">Category</Th>
              <Th className="min-w-[90px]">Location Found</Th>
              <Th className="min-w-[60px]">Day Collected</Th>
              <Th className="min-w-[90px]">Condition</Th>
              <Th className="min-w-[90px]">Lab Test Requested</Th>
              <Th className="min-w-[90px]">Lab Result</Th>
              <Th className="min-w-[120px]">Relevance Notes</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => (
              <tr
                key={n}
                className={n % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="border border-gray-400 px-1 py-1.5 text-center font-bold text-gray-500 text-xs">
                  {n}
                </td>
                <Td>&nbsp;</Td>
                <Td>
                  <span className="text-gray-300 text-[8px] leading-tight block">
                    {categories}
                  </span>
                </Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
                <Td>
                  <span className="text-gray-300 text-[8px] leading-tight block">
                    {conditions}
                  </span>
                </Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Summary Section ────────────────────────────────── */}
      <section className="border border-black p-3 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-3 -mt-3">
          Evidence Summary
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-3">
          <Field label="Total Items Logged" />
          <Field label="Items Sent to Lab" />
        </div>
        <div className="space-y-2 mb-2">
          <p className="text-xs font-bold uppercase tracking-wider">Key Findings:</p>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-gray-400 h-6" />
          ))}
        </div>
        <div className="space-y-2 mt-3">
          <p className="text-xs font-bold uppercase tracking-wider">
            Planted / Suspicious Evidence Notes:
          </p>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border-b border-gray-400 h-6" />
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t-2 border-red-400 pt-2 flex justify-between items-center text-xs uppercase tracking-widest text-gray-500">
        <span className="text-red-500 font-bold">Property of Crime Lab — Do Not Distribute</span>
        <span>Case File Ref: ___________________</span>
      </footer>
    </main>
  );
}

/* ── Helpers ───────────────────────────────────────────────── */

function Field({ label }: { label: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
      <div className="border-b border-black h-6" />
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`border border-gray-600 px-1.5 py-1 text-left font-bold uppercase tracking-wide text-[10px] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border border-gray-300 px-1.5 py-1 h-7 align-top text-xs">{children}</td>
  );
}
