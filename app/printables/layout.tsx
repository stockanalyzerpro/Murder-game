import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'DA Homicide Task Force — Case File Printables',
  description: 'Printable case-file templates for the Murder Investigation board game.',
};

export default function PrintablesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-mono">
        {/* Watermark branding — hidden at print via CSS if desired */}
        <div className="screen-only fixed bottom-4 right-4 text-xs text-gray-300 select-none pointer-events-none z-50 uppercase tracking-widest">
          DA Homicide Task Force
        </div>
        {children}
      </body>
    </html>
  );
}
