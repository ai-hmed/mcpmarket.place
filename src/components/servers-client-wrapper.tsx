"use client";

import { useState } from "react";
import { ServerData } from "@/hooks/use-servers";
import SearchFilter from "@/components/search-filter";
import ServerGrid from "@/components/server-grid";

export default function ServersClientWrapper({
  initialServers,
  categories,
}: {
  initialServers: ServerData[];
  categories: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredServers, setFilteredServers] = useState(initialServers);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterServers(query, activeFilters);
  };

  // Handle filter change
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    filterServers(searchQuery, filters);
  };

  // Filter servers based on search query and active filters
  const filterServers = (query: string, filters: string[]) => {
    let filtered = [...initialServers];

    // Apply search query filter
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (server) =>
          server.title?.toLowerCase().includes(lowercaseQuery) ||
          server.description?.toLowerCase().includes(lowercaseQuery) ||
          server.category?.toLowerCase().includes(lowercaseQuery),
      );
    }

    // Apply category filters
    if (filters.length > 0) {
      filtered = filtered.filter((server) => filters.includes(server.category));
    }

    setFilteredServers(filtered);
  };

  return (
    <div>
      <div className="mb-8">
        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          placeholder="Search servers..."
          availableFilters={categories}
          className="max-w-3xl mx-auto"
        />
      </div>

      {filteredServers.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No servers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      ) : (
        <ServerGrid servers={filteredServers} />
      )}
    </div>
  );
}
