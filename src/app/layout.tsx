import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';

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
        <ParticleBackground />
        <Navigation />
        <main className="relative z-10 min-h-screen pt-20">
          {children}
        </main>
        <footer className="relative z-10 border-t border-black/5 py-8 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-black/30 text-sm">
            © {new Date().getFullYear()} Jake Vallante. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
