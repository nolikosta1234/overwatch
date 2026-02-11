import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import Providers from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'OVERWATCH — Operational Vigilance & Electronic Reconnaissance',
  description: 'Geospatial intelligence dashboard for real-time surveillance and threat analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <Providers>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-56 transition-all duration-300">
              <Topbar />
              <main className="flex-1 overflow-hidden relative grid-bg">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
