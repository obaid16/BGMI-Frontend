import '@/styles/globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import ConditionalLayout from '@/components/common/ConditionalLayout';

export const metadata = {
  title: 'NIT BGMI Esports Championship 2026 | Nexcore Institute of Technology',
  description: 'Official NIT BGMI Esports Championship 2026 organized by Nexcore Institute of Technology. Live matches, standings, squad registration, and tournament statistics.',
  keywords: 'Nexcore Institute of Technology, NIT, BGMI, Esports, College Esports, Battlegrounds Mobile India, Tournament Platform, NIT Gaming',
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('bgmi_esports_theme');
      var pref = saved ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (pref === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bgmi-ivory dark:bg-bgmi-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-bgmi-red selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <SmoothScrollProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </SmoothScrollProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
