"use client";

import ServerCard from "./server-card";
import { useServers, ServerData } from "@/hooks/use-servers";
import SearchFilter from "./search-filter";
import { Skeleton } from "./ui/skeleton";

interface ServerGridProps {
  limit?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
}

export default function ServerGrid({
  limit,
  showSearch = false,
  showFilters = false,
  className = "",
}: ServerGridProps) {
  const {
    servers,
    loading,
    error,
    categories,
    handleSearch,
    handleFilterChange,
  } = useServers();

  // Limit the number of servers if specified
  const displayedServers = limit ? servers.slice(0, limit) : servers;

  // Loading skeleton
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {showSearch && (
          <div className="w-full max-w-md">
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit || 4)].map((_, index) => (
            <div
              key={index}
              className="space-y-3 bg-card border border-border rounded-lg p-4"
            >
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showSearch && (
        <div className="w-full max-w-md">
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={showFilters ? handleFilterChange : undefined}
            placeholder="Search servers..."
            availableFilters={showFilters ? categories : []}
          />
        </div>
      )}

      {displayedServers.length === 0 ? (
        <div className="p-6 text-center border rounded-lg">
          <p className="text-muted-foreground">No servers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedServers.map((server, index) => (
            <ServerCard
              key={index}
              id={server.id}
              title={server.title}
              description={server.description}
              category={server.category}
              deployments={server.deployments}
              imageUrl={server.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
