"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PlayerModal from "./PlayerModal";

interface TeamModalProps {
  isOpen: boolean;
  closeModal: () => void;
  teamId: string;
}

interface TeamData {
  team: {
    name: string;
    crest: string;
    founded: number;
    venue: string;
    coach: {
      name: string;
    };
    squad: Array<{
      name: string;
      position: string;
      nationality: string;
      id: string;
    }>;
  };
  matches: Array<{
    utcDate: string;
    score: {
      fullTime: {
        home: number;
        away: number;
      };
    };
    homeTeam: {
      name: string;
      crest: string;
    };
    awayTeam: {
      name: string;
      crest: string;
    };
  }>;
}

interface Player {
  id: string;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

interface PlayerDetails {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  // Add other fields you want to display
}

export default function TeamModal({
  isOpen,
  closeModal,
  teamId,
}: TeamModalProps) {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && teamId) {
      setLoading(true);
      fetchTeamData();
    }
  }, [isOpen, teamId]);

  const fetchTeamData = async () => {
    try {
      const response = await fetch(`/api/team/${teamId}`);
      const data = await response.json();
      setTeamData(data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-16 h-16">
                      <LoadingSpinner />
                    </div>
                  </div>
                ) : teamData ? (
                  <>
                    {/* Team Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <Image
                        src={teamData.team.crest}
                        alt={teamData.team.name}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                      <div>
                        <Dialog.Title className="text-2xl font-medium text-white">
                          {teamData.team.name}
                        </Dialog.Title>
                        <p className="text-gray-400">
                          Founded: {teamData.team.founded}
                        </p>
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-white mb-2">
                        Team Information
                      </h3>
                      <div className="space-y-2 text-gray-300">
                        <p>Venue: {teamData.team.venue}</p>
                        <p>
                          Coach: {teamData.team.coach?.name || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Squad Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Squad
                      </h3>
                      {[
                        { label: "Goalkeeper", positions: ["Goalkeeper"] },
                        {
                          label: "Defenders",
                          positions: ["Defence", "Left-Back"],
                        },
                        {
                          label: "Midfielders",
                          positions: ["Midfield", "Central Midfield"],
                        },
                        { label: "Attackers", positions: ["Offence"] },
                      ].map(({ label, positions }) => (
                        <div key={label} className="mb-6">
                          <h4 className="text-md text-gray-400 mb-2">
                            {label}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {teamData.team.squad
                              .filter((player) =>
                                positions.includes(player.position)
                              )
                              .map((player) => (
                                <div
                                  key={player.id}
                                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors"
                                  onClick={() => setSelectedPlayerId(player.id)}
                                >
                                  <p className="text-white font-medium">
                                    {player.name}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {player.nationality}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recent Matches */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">
                        Recent Matches
                      </h3>
                      <div className="space-y-4">
                        {teamData.matches
                          .sort(
                            (a, b) =>
                              new Date(b.utcDate).getTime() -
                              new Date(a.utcDate).getTime()
                          )
                          .slice(0, 5)
                          .map((match, index) => (
                            <div
                              key={index}
                              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4"
                            >
                              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={match.homeTeam.crest}
                                    alt={match.homeTeam.name}
                                    width={24}
                                    height={24}
                                  />
                                  <span className="text-white text-left break-words">
                                    {match.homeTeam.name}
                                  </span>
                                </div>
                                <div className="text-white font-medium px-4">
                                  {match.score.fullTime.home} -{" "}
                                  {match.score.fullTime.away}
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="text-white text-right break-words">
                                    {match.awayTeam.name}
                                  </span>
                                  <Image
                                    src={match.awayTeam.crest}
                                    alt={match.awayTeam.name}
                                    width={24}
                                    height={24}
                                  />
                                </div>
                              </div>
                              <div className="text-center text-sm text-gray-400 mt-2">
                                {new Date(match.utcDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                  }
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-white">
                    Failed to load team data
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      <PlayerModal
        isOpen={!!selectedPlayerId}
        closeModal={() => setSelectedPlayerId(null)}
        playerId={selectedPlayerId}
      />
    </Transition>
  );
}
