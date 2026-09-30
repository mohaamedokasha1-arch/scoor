export interface TranslationMap {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const LEAGUE_TRANSLATIONS: TranslationMap = {
  'English Premier League': { ar: 'الدوري الإنجليزي الممتاز', en: 'Premier League' },
  'Premier League': { ar: 'الدوري الإنجليزي الممتاز', en: 'Premier League' },
  'Spanish LALIGA': { ar: 'الدوري الإسباني', en: 'La Liga' },
  'Spanish La Liga': { ar: 'الدوري الإسباني', en: 'La Liga' },
  'LaLiga': { ar: 'الدوري الإسباني', en: 'La Liga' },
  'Italian Serie A': { ar: 'الدوري الإيطالي', en: 'Serie A' },
  'Serie A': { ar: 'الدوري الإيطالي', en: 'Serie A' },
  'German Bundesliga': { ar: 'الدوري الألماني', en: 'Bundesliga' },
  'Bundesliga': { ar: 'الدوري الألماني', en: 'Bundesliga' },
  'French Ligue 1': { ar: 'الدوري الفرنسي', en: 'Ligue 1' },
  'Ligue 1': { ar: 'الدوري الفرنسي', en: 'Ligue 1' },
  'UEFA Champions League': { ar: 'دوري أبطال أوروبا', en: 'UEFA Champions League' },
  'UEFA Europa League': { ar: 'الدوري الأوروبي', en: 'UEFA Europa League' },
  'UEFA Conference League': { ar: 'دوري المؤتمر الأوروبي', en: 'UEFA Conference League' },
  'Saudi Pro League': { ar: 'الدوري السعودي للمحترفين', en: 'Saudi Pro League' },
  'CAF Champions League': { ar: 'دوري أبطال إفريقيا', en: 'CAF Champions League' },
  'English FA Cup': { ar: 'كأس الاتحاد الإنجليزي', en: 'FA Cup' },
  'Spanish Copa del Rey': { ar: 'كأس ملك إسبانيا', en: 'Copa del Rey' },
  'FIFA World Cup': { ar: 'كأس العالم', en: 'FIFA World Cup' },
  'Egyptian Premier League': { ar: 'الدوري المصري الممتاز', en: 'Egyptian Premier League' },
  'Moroccan Pro League': { ar: 'الدوري المغربي', en: 'Botola Pro' },
  'AFC Champions League Elite': { ar: 'دوري أبطال آسيا للنخبة', en: 'AFC Champions League Elite' },
  'UEFA Nations League': { ar: 'دوري الأمم الأوروبية', en: 'UEFA Nations League' },
  'International Friendly': { ar: 'مباراة ودية دولية', en: 'International Friendly' },
  'Club Friendly': { ar: 'مباراة ودية للأندية', en: 'Club Friendly' },
};

export const TEAM_TRANSLATIONS: TranslationMap = {
  'Real Madrid': { ar: 'ريال مدريد', en: 'Real Madrid' },
  'Barcelona': { ar: 'برشلونة', en: 'Barcelona' },
  'Manchester City': { ar: 'مانشستر سيتي', en: 'Manchester City' },
  'Liverpool': { ar: 'ليفربول', en: 'Liverpool' },
  'Arsenal': { ar: 'أرسنال', en: 'Arsenal' },
  'Manchester United': { ar: 'مانشستر يونايتد', en: 'Manchester United' },
  'Chelsea': { ar: 'تشيلسي', en: 'Chelsea' },
  'Tottenham Hotspur': { ar: 'توتنهام هوتسبير', en: 'Tottenham Hotspur' },
  'Tottenham': { ar: 'توتنهام', en: 'Tottenham' },
  'Bayern Munich': { ar: 'بايرن ميونخ', en: 'Bayern Munich' },
  'Borussia Dortmund': { ar: 'بوروسيا دورتموند', en: 'Borussia Dortmund' },
  'Paris Saint-Germain': { ar: 'باريس سان جيرمان', en: 'PSG' },
  'PSG': { ar: 'باريس سان جيرمان', en: 'PSG' },
  'Juventus': { ar: 'يوفنتوس', en: 'Juventus' },
  'Inter Milan': { ar: 'إنتر ميلان', en: 'Inter Milan' },
  'AC Milan': { ar: 'إيه سي ميلان', en: 'AC Milan' },
  'Atletico Madrid': { ar: 'أتلتيكو مدريد', en: 'Atletico Madrid' },
  'Atlético Madrid': { ar: 'أتلتيكو مدريد', en: 'Atletico Madrid' },
  'Al Hilal': { ar: 'الهلال', en: 'Al Hilal' },
  'Al Nassr': { ar: 'النصر', en: 'Al Nassr' },
  'Al Ittihad': { ar: 'الاتحاد', en: 'Al Ittihad' },
  'Al Ahli': { ar: 'الأهلي', en: 'Al Ahli' },
  'Al Ahly': { ar: 'الأهلي المصري', en: 'Al Ahly' },
  'Zamalek': { ar: 'الزمالك', en: 'Zamalek' },
  'Pyramids': { ar: 'بيراميدز', en: 'Pyramids' },
  'Wydad AC': { ar: 'الوداد الرياضي', en: 'Wydad AC' },
  'Raja CA': { ar: 'الرجاء الرياضي', en: 'Raja CA' },
  'Esperance de Tunis': { ar: 'الترجي التونسي', en: 'Esperance' },
  'Aston Villa': { ar: 'أستون فيلا', en: 'Aston Villa' },
  'Newcastle United': { ar: 'نيوكاسل يونايتد', en: 'Newcastle United' },
  'Brighton & Hove Albion': { ar: 'برايتون', en: 'Brighton' },
  'Brighton': { ar: 'برايتون', en: 'Brighton' },
  'West Ham United': { ar: 'وست هام', en: 'West Ham' },
  'Everton': { ar: 'إيفرتون', en: 'Everton' },
  'Napoli': { ar: 'نابولي', en: 'Napoli' },
  'AS Roma': { ar: 'روما', en: 'AS Roma' },
  'Lazio': { ar: 'لاتسيو', en: 'Lazio' },
  'Bayer Leverkusen': { ar: 'باير ليفركوزن', en: 'Bayer Leverkusen' },
  'RB Leipzig': { ar: 'لايبزيج', en: 'RB Leipzig' },
  'Monaco': { ar: 'موناكو', en: 'Monaco' },
  'Marseille': { ar: 'مارسيليا', en: 'Marseille' },
  'Lyon': { ar: 'ليون', en: 'Lyon' },
  'Lille': { ar: 'ليل', en: 'Lille' },
};

export function translateLeague(name: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!name) return '';
  const item = LEAGUE_TRANSLATIONS[name] || Object.values(LEAGUE_TRANSLATIONS).find(
    (_, key) => name.toLowerCase().includes(Object.keys(LEAGUE_TRANSLATIONS)[key]?.toLowerCase() || '___')
  );
  if (item) return item[lang];
  return name;
}

export function translateTeam(name: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!name) return '';
  const item = TEAM_TRANSLATIONS[name];
  if (item) return item[lang];
  return name;
}

export function translateMatchStatus(statusState: string, statusDetail: string, lang: 'ar' | 'en' = 'ar'): { text: string; isLive: boolean; isFinished: boolean } {
  const stateLower = (statusState || '').toLowerCase();
  const detailLower = (statusDetail || '').toLowerCase();

  if (stateLower === 'in' || stateLower === 'live' || detailLower.includes('half') || detailLower.includes('period') || detailLower.includes("'")) {
    if (detailLower.includes('half time') || detailLower.includes('ht') || statusDetail === 'HT') {
      return { text: lang === 'ar' ? 'استراحة' : 'Half Time', isLive: true, isFinished: false };
    }
    return { text: lang === 'ar' ? 'جارية الآن' : 'Live', isLive: true, isFinished: false };
  }

  if (stateLower === 'post' || stateLower === 'final' || detailLower.includes('ft') || detailLower.includes('aet') || detailLower.includes('pen')) {
    if (detailLower.includes('aet')) return { text: lang === 'ar' ? 'انتهت (وقت إضافي)' : 'FT (AET)', isLive: false, isFinished: true };
    if (detailLower.includes('pen')) return { text: lang === 'ar' ? 'انتهت (ركلات ترجيح)' : 'FT (Pens)', isLive: false, isFinished: true };
    return { text: lang === 'ar' ? 'انتهت' : 'Full Time', isLive: false, isFinished: true };
  }

  if (detailLower.includes('postp') || detailLower.includes('canc')) {
    return { text: lang === 'ar' ? 'مؤجلة' : 'Postponed', isLive: false, isFinished: false };
  }

  return { text: lang === 'ar' ? 'لم تبدأ' : 'Scheduled', isLive: false, isFinished: false };
}

export const STATS_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  possessionPct: { ar: 'الاستحواذ %', en: 'Possession %' },
  shotsOnTarget: { ar: 'التسديدات على المرمى', en: 'Shots on Goal' },
  totalShots: { ar: 'إجمالي التسديدات', en: 'Total Shots' },
  foulCommitted: { ar: 'الأخطاء', en: 'Fouls' },
  wonCorners: { ar: 'الضربات الركنية', en: 'Corner Kicks' },
  offsides: { ar: 'التسلل', en: 'Offsides' },
  yellowCards: { ar: 'البطاقات الصفراء', en: 'Yellow Cards' },
  redCards: { ar: 'البطاقات الحمراء', en: 'Red Cards' },
  saves: { ar: 'التصديات', en: 'Saves' },
};
