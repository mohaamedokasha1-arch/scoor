import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { FavoritesProvider } from '@/components/FavoritesContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'KoraScore - نتائج ومباريات اليوم بث مباشر | KoraScore Live Football Scores',
    template: '%s | KoraScore',
  },
  description: 'تابع مباريات اليوم، مباريات المباشر Live، نتائج المباريات، جدول ترتيب الدوريات، وأبرز الأخبار الرياضية لحظة بلحظة عبر KoraScore.',
  keywords: [
    'مباريات اليوم',
    'مباريات اليوم مباشر',
    'نتائج مباريات اليوم',
    'نتائج المباريات',
    'مباريات كرة القدم',
    'مباريات الأمس',
    'مباريات الغد',
    'live scores',
    'football scores',
    'football matches',
    'today’s matches',
    'KoraScore',
    'كورا سكور',
    'دوري أبطال أوروبا',
    'الدوري الإنجليزي الممتاز',
    'الدوري الإسباني',
    'الدوري السعودي للمحترفين',
  ],
  authors: [{ name: 'KoraScore Team' }],
  creator: 'KoraScore',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: 'https://korascore.com',
    siteName: 'KoraScore',
    title: 'KoraScore - نتائج ومباريات اليوم بث مباشر',
    description: 'الموقع المرجعي والأول لمتابعة مباريات كرة القدم والنتائج المباشرة وجدول الترتيب لحظة بلحظة.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'KoraScore Live Football Scores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KoraScore - نتائج ومباريات اليوم بث مباشر',
    description: 'تغطية حيّة ومباشرة لنتائج ومباريات كرة القدم العالمية والعربية.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950">
        <LanguageProvider>
          <FavoritesProvider>
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
