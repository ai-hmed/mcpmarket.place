"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
  placeholder?: string;
  availableFilters?: string[];
  className?: string;
}

export default function SearchFilter({
  onSearch,
  onFilterChange,
  placeholder = "Search...",
  availableFilters = [],
  className = "",
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Toggle filter
  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];

    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    if (onFilterChange) {
      onFilterChange([]);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  // Effect to handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className={`space-y-3 ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-8 pr-8 bg-background"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {availableFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filter) => (
            <Badge
              key={filter}
              variant={activeFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-6 px-2"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
