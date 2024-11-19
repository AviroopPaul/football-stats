"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner";

interface PlayerModalProps {
  isOpen: boolean;
  closeModal: () => void;
  playerId: string | null;
}

interface PlayerData {
  name: string;
  dateOfBirth: string;
  nationality: string;
  position: string;
  shirtNumber?: number;
  currentTeam: {
    name: string;
    crest: string;
    venue: string;
    founded: number;
    clubColors: string;
    area: {
      name: string;
      flag: string;
    };
  };
}

const getCountryCode = (nationality: string): string => {
  const countryMap: { [key: string]: string } = {
    'England': 'gb',
    'Spain': 'es',
    'France': 'fr',
    'Germany': 'de',
    'Italy': 'it',
    'Portugal': 'pt',
    'Argentina': 'ar',
    'Brazil': 'br',
    'Belgium': 'be',
    'Netherlands': 'nl',
    'Sweden': 'se',
    'Norway': 'no',
    'Denmark': 'dk',
    'Finland': 'fi',
    'Russia': 'ru',
    'Ukraine': 'ua',
    'Mexico': 'mx',
    'Chile': 'cl',
    'Colombia': 'co',
    'Costa Rica': 'cr',
    'Japan': 'jp',
    'South Korea': 'kr',
    'Australia': 'au',
    'New Zealand': 'nz',
    'South Africa': 'za',
    'Egypt': 'eg',
    'Nigeria': 'ng',
    'Ghana': 'gh',
    'Ivory Coast': 'ci',
    'Cameroon': 'cm',
    'Saudi Arabia': 'sa',
    'Iran': 'ir',
    'Turkey': 'tr',
    'Scotland': 'gb',
    'Wales': 'gb',
    'United States': 'us',
    'Peru': 'pe',
    'Uruguay': 'uy',
    'Senegal': 'sn',
    'Mali': 'ml',
    'Tunisia': 'tn',
    'Algeria': 'dz',
    'Austria': 'at',
    'Switzerland': 'ch',
    'Czech Republic': 'cz',
    'Slovakia': 'sk',
    'Croatia': 'hr',
    'Serbia': 'rs',
    'Iceland': 'is',
    'Scotland': 'gb',
    'Wales': 'gb',
    'Philippines': 'ph',
    'Vietnam': 'vn',
    'Thailand': 'th',
    'Malaysia': 'my',
    'Singapore': 'sg',
    // Add more mappings as needed
  };
  return countryMap[nationality]?.toLowerCase() || 'unknown';
};


export default function PlayerModal({
  isOpen,
  closeModal,
  playerId,
}: PlayerModalProps) {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && playerId) {
      setLoading(true);
      fetchPlayerData();
    }
  }, [isOpen, playerId]);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`/api/player/${playerId}`);
      const data = await response.json();
      setPlayerData(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <LoadingSpinner />
                  </div>
                ) : playerData ? (
                  <div className="text-white">
                    <Dialog.Title className="text-2xl font-medium mb-4">
                      {playerData.name}
                    </Dialog.Title>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl">
                          <img 
                            src={`https://flagcdn.com/w40/${getCountryCode(playerData.nationality)}.png`}
                            alt={`${playerData.nationality} flag`}
                            className="w-8 h-8 object-cover rounded"
                          />
                        </span>
                        <div className="space-y-3">
                          <p>
                            <span className="text-gray-400">Date of Birth:</span>{" "}
                            {new Date(playerData.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="text-gray-400">Nationality:</span>{" "}
                            {playerData.nationality}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-gray-700 pt-4">
                        <p>
                          <span className="text-gray-400">Position:</span>{" "}
                          {playerData.position}
                        </p>
                        {playerData.shirtNumber && (
                          <p>
                            <span className="text-gray-400">Shirt Number:</span>{" "}
                            {playerData.shirtNumber}
                          </p>
                        )}
                        <p>
                          <span className="text-gray-400">Current Team:</span>{" "}
                          {playerData.currentTeam.name}
                        </p>
                        <p>
                          <span className="text-gray-400">Stadium:</span>{" "}
                          {playerData.currentTeam.venue}
                        </p>
                        <p>
                          <span className="text-gray-400">Club Founded:</span>{" "}
                          {playerData.currentTeam.founded}
                        </p>
                        <p>
                          <span className="text-gray-400">Club Colors:</span>{" "}
                          {playerData.currentTeam.clubColors}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    Failed to load player data
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 