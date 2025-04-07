import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900 to-purple-950 opacity-80" />
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')" }}></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl sm:text-6xl font-bold text-white mb-8 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                MCP
              </span>
              Market
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                .place
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your premier marketplace for Model Content Protocol servers. Discover, deploy, and manage with one-click deployment across multiple cloud providers.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-colors text-lg font-medium shadow-lg shadow-blue-500/20"
              >
                Browse Servers
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                Create Account
              </Link>
            </motion.div>

            <motion.div
              className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>One-click deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Multiple cloud providers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Developer tools included</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
