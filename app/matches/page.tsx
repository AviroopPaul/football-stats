'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { IoMdHome } from "react-icons/io";

interface Match {
  id: string;
  homeTeam: { name: string; crest: string };
  awayTeam: { name: string; crest: string };
  utcDate: string;
  status: string;
  competition: {
    id: string;
    name: string;
  };
}

function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [competitions, setCompetitions] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4 rows × 3 columns

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch('/api/matches', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = await response.json();
        const sortedMatches = (data.matches || []).sort((a: Match, b: Match) => 
          new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
        );
        setMatches(sortedMatches);
        setFilteredMatches(sortedMatches);
        
        const uniqueCompetitions = new Set(
          sortedMatches.map((match) => match.competition.name)
        );
        setCompetitions(uniqueCompetitions);
      } catch (err) {
        console.error(err);
        setError('Could not fetch matches.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMatches();
  }, []);

  useEffect(() => {
    let filtered = matches;
    
    if (selectedCompetition !== 'all') {
      filtered = filtered.filter(
        (match) => match.competition.name === selectedCompetition
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (match) =>
          match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.competition.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMatches(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCompetition, matches, searchQuery]);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMatches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <Link href="/" className="text-white text-lg mb-4 inline-flex items-center gap-2 hover:text-white/80 transition-colors">
        <IoMdHome className="text-xl" />
        Go to Home
      </Link>

      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Matches
      </h1>

      <div className="max-w-4xl mx-auto flex gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams or competitions..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50"
        />

        <select
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
          className="w-64 bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="all">All Competitions</option>
          {Array.from(competitions).map((competition) => (
            <option key={competition} value={competition}>
              {competition}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="backdrop-blur-md bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((match) => (
              <Link
                href={`/matches/${match.id}`}
                key={match.id}
                className="block h-full"
              >
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4 flex-1">
                    <div className="flex items-center w-full">
                      <div className="text-center w-[40%]">
                        <Image
                          src={match.homeTeam.crest}
                          alt={`${match.homeTeam.name} crest`}
                          width={64}
                          height={64}
                          className="mx-auto transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <p className="text-white mt-2 font-medium truncate">{match.homeTeam.name}</p>
                      </div>
                      
                      <div className="mx-4 w-[20%] text-center">
                        <span className="text-2xl font-bold text-white">VS</span>
                      </div>

                      <div className="text-center w-[40%]">
                        <Image
                          src={match.awayTeam.crest}
                          alt={`${match.awayTeam.name} crest`}
                          width={64}
                          height={64}
                          className="mx-auto transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <p className="text-white mt-2 font-medium truncate">{match.awayTeam.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-green-400 text-sm">{match.status}</span>
                      </div>
                      <time className="text-white/70 text-sm">
                        {new Date(match.utcDate).toLocaleString()}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MatchList;
