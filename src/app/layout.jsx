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
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="https://img.icons8.com/color/48/000000/controller.png" type="image/png" />
      </head>
      <body className="bg-premium-background text-premium-text min-h-screen flex flex-col antialiased selection:bg-premium-sage selection:text-white">
        <ThemeProvider>
          <ToastProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

