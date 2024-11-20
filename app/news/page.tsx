"use client";
import { useState, useEffect } from "react";
import { getFootballNews } from "@/app/services/newsService";
import Image from "next/image";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";

// Add this function before the NewsPage component
function extractKeywords(text: string): string[] {
  // List of common football teams, leagues, and tournaments
  const keywords = [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Champions League",
    "Manchester United",
    "Liverpool",
    "Chelsea",
    "Arsenal",
    "Manchester City",
    "Real Madrid",
    "Barcelona",
    "Bayern Munich",
    "PSG",
    "UEFA",
    "FIFA",
  ];

  const foundKeywords = keywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );

  // Return up to 5 keywords, or fewer if less were found
  return foundKeywords.slice(0, 5);
}

// Add these new interfaces
interface NewsFilters {
  search: string;
  league: string;
  country: string;
}

const ITEMS_PER_PAGE = 9;

// Add these filter options
const FILTER_OPTIONS = {
  leagues: [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Champions League",
  ],
  countries: ["England", "Spain", "Italy", "Germany", "France"],
};

// Add these categories
const NEWS_CATEGORIES = [
  "Transfer News",
  "Injuries",
  "Team News",
  "Highlights",
];

export default function NewsPage() {
  const [news, setNews] = useState({ articles: [] });
  const [filters, setFilters] = useState<NewsFilters>({
    search: "",
    league: "",
    country: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch news on component mount
  useEffect(() => {
    const fetchNews = async () => {
      const newsData = await getFootballNews(selectedCategory);
      setNews(newsData);
    };
    fetchNews();
  }, [selectedCategory]);

  // Filter and search logic
  const filteredNews = news.articles.filter((article) => {
    const content = (article.title + " " + article.description).toLowerCase();
    const searchMatch =
      filters.search === "" || content.includes(filters.search.toLowerCase());
    const leagueMatch =
      filters.league === "" || content.includes(filters.league.toLowerCase());
    const countryMatch =
      filters.country === "" || content.includes(filters.country.toLowerCase());

    return searchMatch && leagueMatch && countryMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-6">
        <Link
          href="/"
          className="text-white text-lg mb-4 inline-flex items-center gap-2 hover:text-white/80 transition-colors"
        >
          <IoMdHome className="text-xl" />
          Go to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Latest Football News
        </h1>

        {/* Add filters section */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search news..."
            className="p-2 rounded-lg bg-white/10 text-white border border-white/20 w-full col-span-2"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <div className="flex gap-4">
            <select
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 w-full"
              value={filters.league}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, league: e.target.value }))
              }
            >
              <option value="">All Leagues</option>
              {FILTER_OPTIONS.leagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>

            <select
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 w-full"
              value={filters.country}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, country: e.target.value }))
              }
            >
              <option value="">All Countries</option>
              {FILTER_OPTIONS.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add category tags after the filters section */}
        <div className="mb-6 flex flex-wrap gap-3">
          {NEWS_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category === selectedCategory ? "" : category
                )
              }
              className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                category === selectedCategory
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Existing news grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.map((article, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl overflow-hidden shadow-lg hover:bg-white/20 transition-all duration-300 group flex flex-col h-full"
            >
              {article.urlToImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {article.title}
                </h2>
                <p className="text-white/70 mb-4">{article.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {extractKeywords(
                    article.title + " " + article.description
                  ).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors duration-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
                  <span className="text-white/70 text-sm">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 transition-colors duration-300"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add pagination controls */}
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
