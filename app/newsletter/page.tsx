"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Successfully subscribed to the newsletter!");
        setEmail("");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 shadow-2xl">
        <Link href="/" className="text-white text-lg mb-4 inline-flex items-center gap-2 hover:text-white/80 transition-colors">
          <IoMdHome className="text-xl" />
          Go to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Subscribe to Our Newsletter
        </h1>
        <p className="text-white/70 mb-8 text-center">
          Get the latest football news, match updates, and exclusive content
          delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === "loading"}
            className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </motion.button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
} 