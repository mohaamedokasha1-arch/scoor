'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favoriteMatches: string[];
  favoriteTeams: string[];
  favoriteLeagues: string[];
  toggleFavoriteMatch: (matchId: string) => void;
  toggleFavoriteTeam: (teamId: string) => void;
  toggleFavoriteLeague: (leagueId: string) => void;
  isMatchFavorite: (matchId: string) => boolean;
  isTeamFavorite: (teamId: string) => boolean;
  isLeagueFavorite: (leagueId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [favoriteLeagues, setFavoriteLeagues] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedMatches = JSON.parse(localStorage.getItem('ks_fav_matches') || '[]');
      const savedTeams = JSON.parse(localStorage.getItem('ks_fav_teams') || '[]');
      const savedLeagues = JSON.parse(localStorage.getItem('ks_fav_leagues') || '[]');
      setFavoriteMatches(savedMatches);
      setFavoriteTeams(savedTeams);
      setFavoriteLeagues(savedLeagues);
    } catch {
      // fallback
    }
  }, []);

  const toggleFavoriteMatch = (matchId: string) => {
    setFavoriteMatches((prev) => {
      const updated = prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId];
      localStorage.setItem('ks_fav_matches', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavoriteTeam = (teamId: string) => {
    setFavoriteTeams((prev) => {
      const updated = prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId];
      localStorage.setItem('ks_fav_teams', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavoriteLeague = (leagueId: string) => {
    setFavoriteLeagues((prev) => {
      const updated = prev.includes(leagueId)
        ? prev.filter((id) => id !== leagueId)
        : [...prev, leagueId];
      localStorage.setItem('ks_fav_leagues', JSON.stringify(updated));
      return updated;
    });
  };

  const isMatchFavorite = (matchId: string) => favoriteMatches.includes(matchId);
  const isTeamFavorite = (teamId: string) => favoriteTeams.includes(teamId);
  const isLeagueFavorite = (leagueId: string) => favoriteLeagues.includes(leagueId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteMatches,
        favoriteTeams,
        favoriteLeagues,
        toggleFavoriteMatch,
        toggleFavoriteTeam,
        toggleFavoriteLeague,
        isMatchFavorite,
        isTeamFavorite,
        isLeagueFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
