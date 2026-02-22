export default function ChargingPacket() {
  const chargeTypes = [
    'Murder — 1st Degree',
    'Murder — 2nd Degree',
    'Voluntary Manslaughter',
    'Involuntary Manslaughter',
  ];

  const forensicRows = Array.from({ length: 4 });
  const witnessRows = Array.from({ length: 4 });
  const evidenceLines = Array.from({ length: 10 });

  return (
    <main className="max-w-[8.5in] mx-auto px-8 py-6 text-black bg-white print:p-0">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-gray-900 text-white px-6 py-4 mb-6 avoid-break">
        <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-1">
          District Attorney — Homicide Division
        </p>
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          Formal Charging Packet
        </h1>
        <p className="text-gray-400 text-xs mt-1 tracking-wider uppercase">
          Confidential — DA Homicide Task Force
        </p>
      </header>

      {/* ── Case Information ──────────────────────────────── */}
      <section className="border border-black p-4 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
          Case Information
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <Field label="Case Number" />
          <Field label="Date" />
          <Field label="Lead Investigator" />
          <Field label="Precinct / Jurisdiction" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* ── Accused ──────────────────────────────────────── */}
        <section className="border border-black p-4 avoid-break">
          <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
            Accused
          </h2>
          <div className="space-y-3">
            <Field label="Full Name" />
            <Field label="Relationship to Victim" />
            <Field label="Last Known Address" />
          </div>
        </section>

        {/* ── Victim Information ───────────────────────────── */}
        <section className="border border-black p-4 avoid-break">
          <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
            Victim Information
          </h2>
          <div className="space-y-3">
            <Field label="Full Name" />
            <Field label="Age" />
            <Field label="Cause of Death" />
          </div>
        </section>
      </div>

      {/* ── Charge Filed ─────────────────────────────────── */}
      <section className="border border-black p-4 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
          Charge Filed
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {chargeTypes.map((charge) => (
            <label key={charge} className="flex items-center gap-3 cursor-pointer">
              <span className="inline-block w-5 h-5 border-2 border-black flex-shrink-0" />
              <span className="text-sm font-semibold uppercase tracking-wide">{charge}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Alleged Motive ───────────────────────────────── */}
      <section className="border border-black p-4 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
          Alleged Motive
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-gray-400 h-7" />
          ))}
        </div>
      </section>

      {/* ── Supporting Evidence ──────────────────────────── */}
      <section className="border border-black p-4 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
          Supporting Evidence
        </h2>
        <div className="space-y-2">
          {evidenceLines.map((_, i) => (
            <div key={i} className="flex gap-3 items-end">
              <span className="text-xs font-bold text-gray-500 w-5 flex-shrink-0">{i + 1}.</span>
              <div className="flex-1 border-b border-gray-400 h-6" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Forensic Results Summary ─────────────────────── */}
      <section className="border border-black p-4 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
          Forensic Results Summary
        </h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <Th>Test Name</Th>
              <Th>Result</Th>
              <Th>Relevance</Th>
            </tr>
          </thead>
          <tbody>
            {forensicRows.map((_, i) => (
              <tr key={i}>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Witness Statements Referenced ───────────────── */}
      <section className="border border-black p-4 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
          Witness Statements Referenced
        </h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <Th className="w-1/4">Witness Name</Th>
              <Th>Relevant Statement Summary</Th>
            </tr>
          </thead>
          <tbody>
            {witnessRows.map((_, i) => (
              <tr key={i}>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Prosecution Summary ──────────────────────────── */}
      <section className="border border-black p-4 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-4 -mt-4">
          Prosecution Summary
        </h2>
        <p className="text-xs text-gray-500 mb-2">
          Provide a narrative account of how the crime occurred based on your investigation:
        </p>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-gray-400 h-7" />
          ))}
        </div>
      </section>

      {/* ── Signature ────────────────────────────────────── */}
      <section className="border border-black p-4 mb-6 avoid-break">
        <div className="flex gap-16 items-end">
          <div className="flex-1">
            <div className="border-b-2 border-black h-8 mb-1" />
            <p className="text-xs uppercase tracking-wider text-gray-600">Submitted By</p>
          </div>
          <div className="flex-1">
            <div className="border-b-2 border-black h-8 mb-1" />
            <p className="text-xs uppercase tracking-wider text-gray-600">Date</p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t-2 border-red-400 pt-3 flex justify-between items-center text-xs uppercase tracking-widest text-gray-500">
        <span className="text-red-500 font-bold">Confidential — DA Homicide Task Force</span>
        <span>Case File Ref: ___________________</span>
      </footer>
    </main>
  );
}

/* ── Tiny helpers ──────────────────────────────────────────── */

function Field({ label }: { label: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <div className="border-b border-black h-7" />
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`border border-black px-2 py-1 text-left font-bold uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border border-black px-2 py-2 text-left h-8">{children}</td>
  );
}
