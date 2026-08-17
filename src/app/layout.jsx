import '@/styles/globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ConditionalLayout from '@/components/common/ConditionalLayout';

export const metadata = {
  title: 'NIT BGMI Esports Championship 2026 | Nexcore Institute of Technology',
  description: 'Official NIT BGMI Esports Championship 2026 organized by Nexcore Institute of Technology. Live matches, standings, squad registration, and tournament statistics.',
  keywords: 'Nexcore Institute of Technology, NIT, BGMI, Esports, College Esports, Battlegrounds Mobile India, Tournament Platform, NIT Gaming',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 dark:bg-bgmi-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-bgmi-red selection:text-white">
        <ThemeProvider>
          <ToastProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

