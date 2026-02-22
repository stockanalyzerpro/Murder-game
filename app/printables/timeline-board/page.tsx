export default function TimelineBoard() {
  const timeSlots = [
    '6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM',
    '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM',
    '10:00 PM', '12:00 AM', '2:00 AM', '4:00 AM',
  ];

  const locationBoxes = Array.from({ length: 6 });
  const suspectRows = Array.from({ length: 6 });

  return (
    <main className="max-w-[11in] mx-auto px-6 py-4 text-black bg-white print:p-0 print-landscape">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-gray-900 text-white px-6 py-3 mb-4 avoid-break">
        <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-0.5">
          Restricted — Active Investigation
        </p>
        <h1 className="text-xl font-bold uppercase tracking-widest">
          Incident Timeline Reconstruction — Homicide Division
        </h1>
        <p className="text-gray-400 text-xs mt-0.5 tracking-wider uppercase">
          Homicide Case File — Do Not Remove from Evidence Room
        </p>
      </header>

      {/* ── Case Info + Victim Profile ─────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <section className="col-span-2 border border-black p-3 avoid-break">
          <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-3 -mt-3">
            Case Information
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Case Number" />
            <Field label="Victim" />
            <Field label="Date of Incident" />
          </div>
        </section>

        <section className="border border-black p-3 avoid-break">
          <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-3 -mt-3">
            Victim Profile
          </h2>
          <div className="space-y-2">
            <SmallField label="Name" />
            <SmallField label="Age" />
            <SmallField label="Occupation" />
            <SmallField label="Last Seen" />
          </div>
        </section>
      </div>

      {/* ── Timeline Grid ──────────────────────────────────── */}
      <section className="border border-black mb-4 avoid-break">
        <div className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
          Timeline of Events
        </div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <Th className="w-24 text-center">Time</Th>
              <Th>Event / Observation</Th>
              <Th className="w-32">Source</Th>
              <Th className="w-36">Suspect Involved</Th>
              <Th className="w-16 text-center">Verified</Th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, i) => (
              <tr key={time} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-400 px-2 py-2 font-bold text-center text-xs text-gray-700">
                  {time}
                </td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
                <td className="border border-gray-400 px-2 py-2 text-center">
                  <span className="inline-block w-4 h-4 border-2 border-black" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* ── Key Locations ──────────────────────────────────── */}
        <section className="border border-black p-3 avoid-break">
          <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-3 -mt-3">
            Key Locations
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {locationBoxes.map((_, i) => (
              <div key={i} className="border border-gray-300 p-2">
                <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">
                  Location {i + 1}
                </p>
                <div className="border-b border-gray-300 h-5 mb-1" />
                <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">
                  Address / Description
                </p>
                <div className="border-b border-gray-300 h-5" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Suspect Movement Tracker ───────────────────────── */}
        <section className="border border-black avoid-break">
          <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
            Suspect Movement Tracker
          </h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <Th>Suspect Name</Th>
                <Th>Alibi Claimed</Th>
                <Th className="w-16 text-center">Verified Y/N</Th>
                <Th>Conflicts / Notes</Th>
              </tr>
            </thead>
            <tbody>
              {suspectRows.map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <Td>&nbsp;</Td>
                  <Td>&nbsp;</Td>
                  <td className="border border-gray-300 px-2 py-2 text-center h-8">
                    <span className="inline-block w-4 h-4 border-2 border-black" />
                  </td>
                  <Td>&nbsp;</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* ── Investigator Notes ─────────────────────────────── */}
      <section className="border border-black p-3 mb-4 avoid-break">
        <h2 className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-3 -mx-3 -mt-3">
          Investigator Notes
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-gray-400 h-7" />
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t-2 border-red-400 pt-2 flex justify-between items-center text-xs uppercase tracking-widest text-gray-500">
        <span className="text-red-500 font-bold">
          Restricted — Active Investigation — Homicide Case File
        </span>
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

function SmallField({ label }: { label: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
      <div className="border-b border-black h-5" />
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`border border-gray-600 px-2 py-1 text-left font-bold uppercase tracking-wide text-[10px] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border border-gray-300 px-2 py-2 h-8 align-top text-xs">{children}</td>
  );
}
