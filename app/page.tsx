"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <main className="min-h-screen p-6 flex items-center justify-center w-full">
      <div className="backdrop-blur-md bg-black/10 rounded-2xl p-12 shadow-2xl border border-white/20">
        <div className="container mx-auto flex flex-col items-center justify-center relative z-10 text-center">
          <h1 className="text-8xl font-bold text-emerald-50 mb-8 drop-shadow-lg">
            F<span className="text-6xl">⚽️⚽️</span>tStats
          </h1>
          <p className="text-2xl text-emerald-100 mb-12 max-w-2xl drop-shadow-md">
            scores, stats, and insights
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
            {[
              { title: "Past Matches", color: "yellow" },
              { title: "Statistics", color: "red" },
              { title: "Team Rankings", color: "yellow" },
            ].map(({ title, color }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  backdrop-blur-md rounded-xl p-6 transition-all duration-300
                  shadow-lg border-2
                  bg-black/5 hover:bg-white/20
                  transform hover:-translate-y-1 hover:shadow-2xl
                  ${
                    color === "yellow"
                      ? "border-yellow-400 hover:border-yellow-300"
                      : ""
                  }
                  ${
                    color === "red" ? "border-red-600 hover:border-red-500" : ""
                  }
                  ${
                    color === "blue"
                      ? "border-blue-600 hover:border-blue-500"
                      : ""
                  }
                `}
              >
                <h3
                  className={`text-xl font-semibold mb-2 
                  ${color === "yellow" ? "text-yellow-400" : ""}
                  ${color === "red" ? "text-red-500" : ""}
                  ${color === "blue" ? "text-blue-500" : ""}`}
                >
                  {title}
                </h3>
                <p className="text-white/90">
                  Access {title.toLowerCase()} and detailed analysis
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-4"
          >
            <Link
              href="/matches"
              className="inline-flex items-center px-8 py-4 border border-white text-white rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all backdrop-blur-md shadow-lg bg-white/10"
            >
              View Matches
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center px-8 py-4 border border-white text-white rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all backdrop-blur-md shadow-lg bg-white/10"
            >
              Get Latest News
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"
                />
              </svg>
            </Link>
            <Link
              href="/newsletter"
              className="inline-flex items-center px-8 py-4 border border-emerald-400 text-emerald-400 rounded-xl font-semibold text-lg hover:bg-emerald-400 hover:text-white transition-all backdrop-blur-md shadow-lg bg-white/10"
            >
              Newsletter Signup
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          src="https://cdn.pixabay.com/photo/2016/12/30/10/58/san-siro-1940307_1280.jpg"
          alt="Football background"
          className="object-cover w-full h-full"
        />
      </div>
    </main>
  );
};

export default HomePage;
