export interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  published: string;
  imageUrl?: string;
  source: string;
  url: string;
  category?: string;
}

export async function fetchFootballNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/all/news?limit=20', {
      headers: { 'User-Agent': 'KoraScore/1.0 News App' },
      next: { revalidate: 300 },
    });

    if (!res.ok) return getFallbackNews();

    const json = await res.json();
    const articles = json.articles || [];

    const formattedArticles: NewsArticle[] = articles.map((art: any) => {
      const img = art.images?.[0]?.url;
      const link = art.links?.web?.href || art.links?.api?.news?.href || 'https://www.espn.com/soccer/';

      return {
        id: String(art.id || Math.random()),
        headline: art.headline || 'خبر رياضي من الملاعب العالمية',
        description: art.description || art.story || 'تابع أحدث التطورات والتحليلات لمباريات اليوم وأبرز الانتقالات.',
        published: art.published ? new Date(art.published).toISOString() : new Date().toISOString(),
        imageUrl: img || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        source: art.dataSourceIdentifier || 'ESPN Soccer / KoraScore',
        url: link,
        category: art.categories?.[0]?.description || 'كرة عالمية',
      };
    });

    return formattedArticles.length > 0 ? formattedArticles : getFallbackNews();
  } catch (err) {
    console.error('Error fetching football news:', err);
    return getFallbackNews();
  }
}

function getFallbackNews(): NewsArticle[] {
  return [
    {
      id: 'news_1',
      headline: 'تغطية مستمرة لأبرز مواجهات الدوريات الكبرى ودوري أبطال أوروبا',
      description: 'منافسة محتدمة في الصدارة بين أعرق أندية أوروبا وتغطية حصرية لنتائج مباريات اليوم لحظة بلحظة عبر KoraScore.',
      published: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      source: 'KoraScore Sports',
      url: '/matches/today',
      category: 'الدوريات الكبرى',
    },
    {
      id: 'news_2',
      headline: 'استعدادات مكثفة لفرق الدوري السعودي للمحترفين مع انطلاق الجولات الحسم',
      description: 'أجواء حماسية في الملاعب السعودية مع اشتداد المنافسة بين كبار الأندية على اللقب والمراكز المؤهلة للبطولات الآسيوية.',
      published: new Date(Date.now() - 3600000 * 2).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      source: 'KoraScore Sports',
      url: '/matches/today',
      category: 'دوري روشن',
    },
  ];
}
