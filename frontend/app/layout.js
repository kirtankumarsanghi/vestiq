import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';

export const metadata = {
  title: 'Vestiq — AI Wealth Co-Pilot',
  description: 'Your personal CFO in your pocket.',
  icons: {
    icon: '/brand-mark.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <div className="app-backdrop" aria-hidden />
          <div className="app-root">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}