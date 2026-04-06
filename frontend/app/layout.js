import '../styles/globals.css';

export const metadata = {
  title: 'Vestiq — AI Wealth Co-Pilot',
  description: 'Your personal CFO in your pocket.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}