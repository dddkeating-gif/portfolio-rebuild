import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import CursorBackground from '@/components/CursorBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Jake Vallante — Portfolio',
  description: 'Creative portfolio of Jake Vallante — Graphic Design, Animation, Photography, and Coding',
  openGraph: {
    title: 'Jake Vallante — Portfolio',
    description: 'Creative portfolio of Jake Vallante',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CustomCursor />
        <CursorBackground />
        <Navigation />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
