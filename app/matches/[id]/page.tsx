"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useState, useEffect } from "react";
import TeamModal from "../../components/TeamModal";

async function getMatchDetails(id: string) {
  const res = await fetch(`/api/match/${id}`);
  if (!res.ok) throw new Error("Failed to fetch match details");
  return res.json();
}

export default function MatchDetails({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <Link
        href="/matches"
        className="inline-flex items-center gap-2 mb-8 text-white hover:text-white transition-colors duration-200"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Matches</span>
      </Link>

      <MatchContent id={params.id} />
    </div>
  );
}

function MatchContent({ id }: { id: string }) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface Match {
    id: string;
    competition: {
      name: string;
      emblem: string;
    };
    matchday: number;
    utcDate: string;
    // Add other relevant fields as needed
  }

  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatchDetails() {
      try {
        const data = await getMatchDetails(id);
        setMatch(data);
      } catch (err) {
        setError("Failed to fetch match details");
      } finally {
        setIsLoading(false);
      }
    }

    loadMatchDetails();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-white">{error}</div>;
  if (!match) return null;

  return (
    <>
      {/* Match Header */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              {" "}
              {/* Added white background for competition logo */}
              <Image
                src={match.competition.emblem}
                alt={match.competition.name}
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">
                {match.competition.name}
              </h1>
              <p className="text-white text-sm">Matchday {match.matchday}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">
              {new Date(match.utcDate).toLocaleDateString()}
            </p>
            <p className="text-white text-sm">{match.status}</p>
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 mb-6">
        <div className="grid grid-cols-3 items-center gap-8">
          {/* Home Team */}
          <div
            className="text-center p-4 rounded-lg transition-all duration-300 cursor-pointer hover:bg-white/20"
            onClick={() => {
              setSelectedTeamId(match.homeTeam.id);
              setIsModalOpen(true);
            }}
          >
            <Image
              src={match.homeTeam.crest}
              alt={match.homeTeam.name}
              width={80}
              height={80}
              className="mx-auto mb-3"
            />
            <h2 className="text-lg font-medium text-white">
              {match.homeTeam.name}
            </h2>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </div>
            <div className="text-sm text-white">
              Half-time: {match.score.halfTime.home} -{" "}
              {match.score.halfTime.away}
            </div>
          </div>

          {/* Away Team */}
          <div
            className="text-center p-4 rounded-lg transition-all duration-300 cursor-pointer hover:bg-white/20"
            onClick={() => {
              setSelectedTeamId(match.awayTeam.id);
              setIsModalOpen(true);
            }}
          >
            <Image
              src={match.awayTeam.crest}
              alt={match.awayTeam.name}
              width={80}
              height={80}
              className="mx-auto mb-3"
            />
            <h2 className="text-lg font-medium text-white">
              {match.awayTeam.name}
            </h2>
          </div>
        </div>

        {/* Match Events Section */}
        <div className="mt-8 border-t border-white/20 pt-6">
          <h3 className="text-lg font-medium mb-4 text-center text-white">
            Match Timeline
          </h3>
          <div className="space-y-3">
            {match.goals?.map(
              (
                goal: { minute: number; scorer: string; team: string },
                index: number
              ) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-medium">
                      {goal.minute}&apos;
                    </span>
                    <span className="text-sm text-white">⚽</span>
                    <span className="text-sm text-white">{goal.scorer}</span>
                  </div>
                  <div className="text-sm text-white">
                    {goal.team === "HOME_TEAM"
                      ? match.homeTeam.shortName
                      : match.awayTeam.shortName}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Match Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
          <h3 className="font-medium mb-4 text-white">Match Details</h3>
          <div className="space-y-2 text-sm">
            <p className="text-white">
              Competition:{" "}
              <span className="text-white">{match.competition.name}</span>
            </p>
            <p className="text-white">
              Stage:{" "}
              <span className="text-white">
                {match.stage.replace("_", " ")}
              </span>
            </p>
            <p className="text-white">
              Venue:{" "}
              <span className="text-white">
                {match.venue || "Not specified"}
              </span>
            </p>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
          <h3 className="font-medium mb-4 text-white">Season Information</h3>
          <div className="space-y-2 text-sm">
            <p className="text-white">
              Start:{" "}
              <span className="text-white">
                {new Date(match.season.startDate).toLocaleDateString()}
              </span>
            </p>
            <p className="text-white">
              End:{" "}
              <span className="text-white">
                {new Date(match.season.endDate).toLocaleDateString()}
              </span>
            </p>
            <p className="text-white">
              Current Matchday:{" "}
              <span className="text-white">{match.season.currentMatchday}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Team Modal */}
      {selectedTeamId && (
        <TeamModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          teamId={selectedTeamId}
        />
      )}
    </>
  );
}
