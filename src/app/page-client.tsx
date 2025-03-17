"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface AppCardProps {
  title: string;
  author: string;
  description: string;
  rating: number;
  category: string;
  icon: string;
  downloads: string;
  compact?: boolean;
}

export function AppCard({
  title,
  author,
  description,
  rating,
  category,
  icon,
  downloads,
  compact = false,
}: AppCardProps) {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient
                id="half-star-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half-star-gradient)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>,
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      }
    }

    return stars;
  };

  // Function to get icon based on name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "github":
        return (
          <motion.div
            className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </motion.div>
        );
      case "n8n":
        return (
          <motion.div
            className="bg-orange-50 dark:bg-orange-950 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FF6D00">
              <path d="M7.5 3h9v18h-9V3zm1.5 1.5v15h6v-15H9zm9-1.5h3v18h-3V3zm-16.5 0h3v18h-3V3z" />
            </svg>
          </motion.div>
        );
      case "linear":
        return (
          <motion.div
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-white font-bold text-xl">L</span>
          </motion.div>
        );
      case "enterprise":
        return (
          <motion.div
            className="bg-blue-50 dark:bg-blue-950 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </motion.div>
        );
      case "secure":
        return (
          <motion.div
            className="bg-green-50 dark:bg-green-950 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </motion.div>
        );
      case "node":
        return (
          <motion.div
            className="bg-gray-50 dark:bg-gray-800 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg
              className="w-8 h-8 text-green-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 10a2 2 0 100-4 2 2 0 000 4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 16a2 2 0 100-4 2 2 0 000 4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 8v8"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 16h3"
              />
            </svg>
          </motion.div>
        );
      case "mobile":
        return (
          <motion.div
            className="bg-purple-50 dark:bg-purple-950 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </motion.div>
        );
      case "lite":
        return (
          <motion.div
            className="bg-yellow-50 dark:bg-yellow-950 rounded-md p-2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </motion.div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-md p-2 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
              />
            </svg>
          </div>
        );
    }
  };

  if (compact) {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10">{getIcon(icon)}</div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium truncate">{title}</h3>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                  {category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{author}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <div className="flex">{renderStars(rating)}</div>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {rating}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{downloads}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border bg-secondary/30 px-4 py-2">
          <Button
            variant="ghost"
            className="w-full text-xs h-7 hover:bg-secondary"
          >
            Install
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12">{getIcon(icon)}</div>
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">{title}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
                {category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{author}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
          {description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <div className="flex">{renderStars(rating)}</div>
            <span className="ml-1 text-sm text-muted-foreground">{rating}</span>
          </div>
          <div className="text-sm text-muted-foreground">{downloads}</div>
        </div>
      </div>

      <div className="border-t border-border bg-secondary/30 px-5 py-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
          Install
        </Button>
      </div>
    </div>
  );
}

export function AnimatedAppIcons() {
  return (
    <div className="relative h-40 mt-8">
      <motion.div
        className="absolute right-1/4 top-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub"
          className="w-16 h-16 object-contain rounded-md shadow-md"
        />
      </motion.div>

      <motion.div
        className="absolute right-1/3 top-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <img
          src="https://n8n.io/favicon.ico"
          alt="n8n"
          className="w-14 h-14 object-contain rounded-md shadow-md bg-white p-1"
        />
      </motion.div>

      <motion.div
        className="absolute right-1/2 top-5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="w-16 h-16 rounded-md shadow-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
          L
        </div>
      </motion.div>
    </div>
  );
}
