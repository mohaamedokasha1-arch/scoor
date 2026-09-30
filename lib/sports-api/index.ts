import { translateLeague, translateTeam, translateMatchStatus } from './translations';

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  score?: number | string;
  winner?: boolean;
}

export interface CompetitionInfo {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  country?: string;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'card' | 'sub' | 'penalty' | 'own_goal' | 'other';
  minute: string;
  teamId?: string;
  player: string;
  detail?: string;
  scoreText?: string;
}

export interface MatchStatItem {
  name: string;
  displayName: string;
  homeValue: string | number;
  awayValue: string | number;
}

export interface PlayerLineup {
  id: string;
  name: string;
  jersey?: string;
  position?: string;
  isCaptain?: boolean;
  starter: boolean;
}

export interface MatchLineups {
  home: {
    formation?: string;
    starters: PlayerLineup[];
    substitutes: PlayerLineup[];
  };
  away: {
    formation?: string;
    starters: PlayerLineup[];
    substitutes: PlayerLineup[];
  };
}

export interface MatchDetail {
  id: string;
  date: string;
  time: string;
  statusText: string;
  statusState: 'pre' | 'in' | 'post';
  isLive: boolean;
  isFinished: boolean;
  clockDisplay?: string;
  league: CompetitionInfo;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  venue?: string;
  referee?: string;
  attendance?: string;
  broadcasts?: string[];
  events?: MatchEvent[];
  stats?: MatchStatItem[];
  lineups?: MatchLineups;
  h2h?: Array<{
    id: string;
    date: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
  }>;
}

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

// Simple in-memory server cache to keep responses fast and prevent API throttling
const memoryCache: Map<string, { timestamp: number; data: any }> = new Map();
const CACHE_TTL_MS = 15000; // 15 seconds for live responsiveness

function getCached<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL_MS) {
    return item.data as T;
  }
  return null;
}

function setCached(key: string, data: any) {
  memoryCache.set(key, { timestamp: Date.now(), data });
}

export async function fetchMatchesForDate(dateStr: string): Promise<MatchDetail[]> {
  // dateStr in format YYYYMMDD, e.g. "20260302" or "20260301"
  const cleanDate = dateStr.replace(/-/g, '');
  const cacheKey = `matches_${cleanDate}`;
  const cached = getCached<MatchDetail[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${ESPN_BASE_URL}/all/scoreboard?dates=${cleanDate}`, {
      headers: { 'User-Agent': 'KoraScore/1.0 Football App' },
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      console.error(`ESPN Scoreboard API status: ${res.status}`);
      return [];
    }

    const json = await res.json();
    const events = json.events || [];

    const matches: MatchDetail[] = events.map((evt: any) => {
      const comp = evt.competitions?.[0] || {};
      const competitors = comp.competitors || [];
      const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0] || {};
      const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1] || {};

      const statusObj = comp.status || {};
      const statusType = statusObj.type || {};
      const state = (statusType.state || 'pre') as 'pre' | 'in' | 'post';
      const detailText = statusType.detail || statusType.description || '';
      const clockDisplay = statusObj.displayClock || (statusObj.clock ? `${Math.floor(statusObj.clock / 60)}'` : '');

      const statusMeta = translateMatchStatus(state, detailText, 'ar');

      const leagueObj = evt.league || json.leagues?.[0] || {};
      const leagueName = leagueObj.name || leagueObj.description || 'كرة القدم';
      const leagueId = leagueObj.id || leagueObj.slug || 'all';

      const homeTeamObj = homeComp.team || {};
      const awayTeamObj = awayComp.team || {};

      const broadcasts = (comp.broadcasts || [])
        .flatMap((b: any) => b.names || [b.media?.shortName])
        .filter(Boolean);

      return {
        id: evt.id,
        date: evt.date,
        time: new Date(evt.date).toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        statusText: statusMeta.text,
        statusState: state,
        isLive: statusMeta.isLive,
        isFinished: statusMeta.isFinished,
        clockDisplay: state === 'in' ? clockDisplay : undefined,
        league: {
          id: leagueId,
          name: leagueName,
          slug: leagueObj.slug,
          logo: leagueObj.logos?.[0]?.href || leagueObj.logo,
          country: leagueObj.midsizeName,
        },
        homeTeam: {
          id: homeTeamObj.id,
          name: homeTeamObj.displayName || homeTeamObj.name || 'الفريق الأول',
          shortName: homeTeamObj.shortDisplayName || homeTeamObj.abbreviation || homeTeamObj.name,
          logo: homeTeamObj.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${homeTeamObj.id}.png`,
          score: homeComp.score ?? '-',
          winner: homeComp.winner,
        },
        awayTeam: {
          id: awayTeamObj.id,
          name: awayTeamObj.displayName || awayTeamObj.name || 'الفريق الثاني',
          shortName: awayTeamObj.shortDisplayName || awayTeamObj.abbreviation || awayTeamObj.name,
          logo: awayTeamObj.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${awayTeamObj.id}.png`,
          score: awayComp.score ?? '-',
          winner: awayComp.winner,
        },
        venue: comp.venue?.fullName ? `${comp.venue.fullName}${comp.venue.address?.city ? ` (${comp.venue.address.city})` : ''}` : undefined,
        broadcasts: broadcasts.length > 0 ? broadcasts : ['beIN SPORTS', 'SSC Sports'],
      };
    });

    setCached(cacheKey, matches);
    return matches;
  } catch (err) {
    console.error('Error fetching matches:', err);
    return [];
  }
}

export async function fetchMatchDetails(matchId: string): Promise<MatchDetail | null> {
  const cacheKey = `match_detail_${matchId}`;
  const cached = getCached<MatchDetail>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${ESPN_BASE_URL}/all/summary?event=${matchId}`, {
      headers: { 'User-Agent': 'KoraScore/1.0 Football App' },
      next: { revalidate: 15 },
    });

    if (!res.ok) return null;
    const json = await res.json();

    const header = json.header || {};
    const comp = header.competitions?.[0] || {};
    const competitors = comp.competitors || [];
    const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0] || {};
    const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1] || {};

    const statusObj = comp.status || {};
    const statusType = statusObj.type || {};
    const state = (statusType.state || 'pre') as 'pre' | 'in' | 'post';
    const detailText = statusType.detail || statusType.description || '';
    const clockDisplay = statusObj.displayClock || (statusObj.clock ? `${Math.floor(statusObj.clock / 60)}'` : '');
    const statusMeta = translateMatchStatus(state, detailText, 'ar');

    const leagueObj = header.league || {};
    const leagueName = leagueObj.name || leagueObj.description || 'كرة القدم';

    // Extract statistics from boxscore
    const boxscoreTeams = json.boxscore?.teams || [];
    const homeBox = boxscoreTeams.find((t: any) => t.team?.id === homeComp.team?.id) || boxscoreTeams[0];
    const awayBox = boxscoreTeams.find((t: any) => t.team?.id === awayComp.team?.id) || boxscoreTeams[1];

    const statsMap: Map<string, { name: string; homeValue: string | number; awayValue: string | number }> = new Map();

    if (homeBox?.statistics && awayBox?.statistics) {
      homeBox.statistics.forEach((hs: any) => {
        const as = awayBox.statistics.find((item: any) => item.name === hs.name);
        if (as) {
          statsMap.set(hs.name, {
            name: hs.name,
            homeValue: hs.displayValue ?? hs.value,
            awayValue: as.displayValue ?? as.value,
          });
        }
      });
    }

    const statsList: MatchStatItem[] = Array.from(statsMap.values()).map((s) => ({
      name: s.name,
      displayName: s.name,
      homeValue: s.homeValue,
      awayValue: s.awayValue,
    }));

    // Extract match events (goals, cards, key plays)
    const keyEvents: MatchEvent[] = [];
    const keyPlays = json.keyEvents || json.plays || [];

    keyPlays.forEach((play: any) => {
      const type = play.type?.text?.toLowerCase() || '';
      const minute = play.clock?.displayValue || play.period?.number ? `${play.clock?.value ? Math.floor(play.clock.value / 60) : ''}'` : '';
      let eventType: MatchEvent['type'] = 'other';

      if (type.includes('goal')) eventType = 'goal';
      else if (type.includes('card')) eventType = 'card';
      else if (type.includes('sub')) eventType = 'sub';
      else if (type.includes('penalty')) eventType = 'penalty';

      keyEvents.push({
        id: play.id || String(Math.random()),
        type: eventType,
        minute: minute || "1'",
        teamId: play.team?.id,
        player: play.text || play.shortText || 'حدث في المباراة',
        detail: play.type?.text,
      });
    });

    // Also parse details from commentary if keyEvents is empty
    if (keyEvents.length === 0 && json.commentary) {
      json.commentary.slice(0, 15).forEach((c: any, i: number) => {
        keyEvents.push({
          id: `comm_${i}`,
          type: c.play?.type?.text?.toLowerCase().includes('goal') ? 'goal' : 'other',
          minute: c.time?.displayValue || '',
          player: c.text,
        });
      });
    }

    // Extract Lineups
    const rosters = json.rosters || [];
    const homeRoster = rosters.find((r: any) => r.team?.id === homeComp.team?.id) || rosters[0];
    const awayRoster = rosters.find((r: any) => r.team?.id === awayComp.team?.id) || rosters[1];

    const parsePlayers = (rosterList: any[] = []) => {
      return rosterList.map((p: any) => ({
        id: p.athlete?.id || String(Math.random()),
        name: p.athlete?.displayName || p.athlete?.shortName || 'لاعب',
        jersey: p.jersey || p.athlete?.jersey,
        position: p.position?.displayName || p.position?.abbreviation,
        isCaptain: p.starter && p.position?.abbreviation === 'C',
        starter: Boolean(p.starter),
      }));
    };

    const lineups: MatchLineups = {
      home: {
        formation: homeRoster?.formation,
        starters: parsePlayers((homeRoster?.roster || []).filter((p: any) => p.starter)),
        substitutes: parsePlayers((homeRoster?.roster || []).filter((p: any) => !p.starter)),
      },
      away: {
        formation: awayRoster?.formation,
        starters: parsePlayers((awayRoster?.roster || []).filter((p: any) => p.starter)),
        substitutes: parsePlayers((awayRoster?.roster || []).filter((p: any) => !p.starter)),
      },
    };

    // Extract Venue & Referee
    const gameInfo = json.gameInfo || {};
    const venueName = gameInfo.venue?.fullName;
    const venueCity = gameInfo.venue?.address?.city;
    const referee = gameInfo.officials?.[0]?.displayName;

    const matchDetail: MatchDetail = {
      id: header.id || matchId,
      date: header.competitions?.[0]?.date || new Date().toISOString(),
      time: new Date(header.competitions?.[0]?.date || Date.now()).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      statusText: statusMeta.text,
      statusState: state,
      isLive: statusMeta.isLive,
      isFinished: statusMeta.isFinished,
      clockDisplay: state === 'in' ? clockDisplay : undefined,
      league: {
        id: leagueObj.id || leagueObj.slug || 'all',
        name: leagueName,
        slug: leagueObj.slug,
        logo: leagueObj.logos?.[0]?.href,
      },
      homeTeam: {
        id: homeComp.team?.id,
        name: homeComp.team?.displayName || homeComp.team?.name || 'الفريق الأول',
        shortName: homeComp.team?.shortDisplayName || homeComp.team?.abbreviation || homeComp.team?.name,
        logo: homeComp.team?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${homeComp.team?.id}.png`,
        score: homeComp.score ?? '-',
      },
      awayTeam: {
        id: awayComp.team?.id,
        name: awayComp.team?.displayName || awayComp.team?.name || 'الفريق الثاني',
        shortName: awayComp.team?.shortDisplayName || awayComp.team?.abbreviation || awayComp.team?.name,
        logo: awayComp.team?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${awayComp.team?.id}.png`,
        score: awayComp.score ?? '-',
      },
      venue: venueName ? `${venueName}${venueCity ? ` (${venueCity})` : ''}` : undefined,
      referee: referee,
      attendance: gameInfo.attendance ? gameInfo.attendance.toLocaleString() : undefined,
      broadcasts: ['beIN SPORTS', 'SSC Sports'],
      stats: statsList,
      events: keyEvents,
      lineups: lineups,
    };

    setCached(cacheKey, matchDetail);
    return matchDetail;
  } catch (err) {
    console.error(`Error fetching match details for ${matchId}:`, err);
    return null;
  }
}

export interface StandingRow {
  rank: number;
  team: {
    id: string;
    name: string;
    logo: string;
  };
  gamesPlayed: number;
  wins: number;
  ties: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export async function fetchLeagueStandings(leagueSlug: string): Promise<{ leagueName: string; standings: StandingRow[] }> {
  // Map common league slugs to ESPN league codes
  const codeMap: Record<string, string> = {
    'premier-league': 'eng.1',
    'eng.1': 'eng.1',
    'la-liga': 'esp.1',
    'esp.1': 'esp.1',
    'serie-a': 'ita.1',
    'ita.1': 'ita.1',
    'bundesliga': 'ger.1',
    'ger.1': 'ger.1',
    'ligue-1': 'fra.1',
    'fra.1': 'fra.1',
    'saudi-pro-league': 'sau.1',
    'sau.1': 'sau.1',
    'champions-league': 'uefa.champions',
    'uefa.champions': 'uefa.champions',
    'caf-champions-league': 'caf.champions',
  };

  const espnLeagueCode = codeMap[leagueSlug] || leagueSlug || 'eng.1';
  const cacheKey = `standings_${espnLeagueCode}`;
  const cached = getCached<{ leagueName: string; standings: StandingRow[] }>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${espnLeagueCode}/standings`, {
      headers: { 'User-Agent': 'KoraScore/1.0 Football App' },
      next: { revalidate: 300 },
    });

    if (!res.ok) return { leagueName: 'جدول الترتيب', standings: [] };
    const json = await res.json();

    const name = json.name || json.abbreviation || 'جدول الترتيب';
    const entries = json.children?.[0]?.standings?.entries || json.standings?.[0]?.entries || [];

    const standings: StandingRow[] = entries.map((e: any, idx: number) => {
      const team = e.team || {};
      const stats = e.stats || [];

      const getStatVal = (name: string, statType?: string) => {
        const item = stats.find((s: any) => s.name === name || s.type === statType);
        return item ? Number(item.value ?? 0) : 0;
      };

      return {
        rank: idx + 1,
        team: {
          id: team.id,
          name: team.displayName || team.name || 'فريق',
          logo: team.logos?.[0]?.href || `https://a.espncdn.com/i/teamlogos/soccer/500/${team.id}.png`,
        },
        gamesPlayed: getStatVal('gamesPlayed', 'gamesplayed'),
        wins: getStatVal('wins', 'wins'),
        ties: getStatVal('ties', 'ties'),
        losses: getStatVal('losses', 'losses'),
        goalsFor: getStatVal('pointsFor', 'pointsfor') || getStatVal('goalsFor'),
        goalsAgainst: getStatVal('pointsAgainst', 'pointsagainst') || getStatVal('goalsAgainst'),
        goalDifference: getStatVal('pointDifferential', 'pointdifferential'),
        points: getStatVal('points', 'points'),
      };
    });

    const result = { leagueName: name, standings };
    setCached(cacheKey, result);
    return result;
  } catch (err) {
    console.error(`Error fetching standings for ${leagueSlug}:`, err);
    return { leagueName: 'جدول الترتيب', standings: [] };
  }
}

export async function fetchTeamData(teamId: string): Promise<{
  id: string;
  name: string;
  logo: string;
  venue?: string;
  recentMatches: MatchDetail[];
  upcomingMatches: MatchDetail[];
} | null> {
  const cacheKey = `team_${teamId}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${teamId}/schedule`, {
      headers: { 'User-Agent': 'KoraScore/1.0 Football App' },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const json = await res.json();

    const teamObj = json.team || {};
    const events = json.events || [];

    const parsedMatches: MatchDetail[] = events.map((evt: any) => {
      const comp = evt.competitions?.[0] || {};
      const competitors = comp.competitors || [];
      const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0] || {};
      const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1] || {};
      const state = comp.status?.type?.state || 'pre';
      const statusMeta = translateMatchStatus(state, comp.status?.type?.detail || '', 'ar');

      return {
        id: evt.id,
        date: evt.date,
        time: new Date(evt.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        statusText: statusMeta.text,
        statusState: state,
        isLive: statusMeta.isLive,
        isFinished: statusMeta.isFinished,
        league: {
          id: evt.league?.id || 'all',
          name: evt.league?.name || 'بطولة',
        },
        homeTeam: {
          id: homeComp.team?.id,
          name: homeComp.team?.displayName || homeComp.team?.name || 'الفريق',
          logo: homeComp.team?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${homeComp.team?.id}.png`,
          score: homeComp.score?.displayValue ?? homeComp.score ?? '-',
        },
        awayTeam: {
          id: awayComp.team?.id,
          name: awayComp.team?.displayName || awayComp.team?.name || 'الفريق',
          logo: awayComp.team?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${awayComp.team?.id}.png`,
          score: awayComp.score?.displayValue ?? awayComp.score ?? '-',
        },
      };
    });

    const recent = parsedMatches.filter((m) => m.isFinished).slice(-5).reverse();
    const upcoming = parsedMatches.filter((m) => !m.isFinished && !m.isLive).slice(0, 5);

    const result = {
      id: teamObj.id || teamId,
      name: teamObj.displayName || teamObj.name || 'الفريق',
      logo: teamObj.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${teamId}.png`,
      venue: teamObj.venue?.fullName,
      recentMatches: recent,
      upcomingMatches: upcoming,
    };

    setCached(cacheKey, result);
    return result;
  } catch (err) {
    console.error(`Error fetching team data for ${teamId}:`, err);
    return null;
  }
}
