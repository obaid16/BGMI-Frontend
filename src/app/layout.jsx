import '@/styles/globals.css';
import { ToastProvider } from '@/context/ToastContext';
import ConditionalLayout from '@/components/common/ConditionalLayout';

export const metadata = {
  title: 'NIT BGMI Esports Championship 2026 | Official Tournament Platform',
  description: 'Official NIT BGMI Esports Tournament Management Platform. Live matches, standings, squad registration, and tournament statistics.',
  keywords: 'NIT, BGMI, Esports, College Esports, Battlegrounds Mobile India, Tournament Platform, NIT Gaming',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bgmi-dark text-slate-100 min-h-screen flex flex-col antialiased selection:bg-bgmi-gold selection:text-slate-950 select-none">
        <ToastProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
