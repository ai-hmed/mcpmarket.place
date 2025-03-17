"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Server, Cloud, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ServerCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  deployments: number;
  imageUrl?: string;
  compact?: boolean;
}

export default function ServerCard({
  id = "server-id",
  title = "mCP Server",
  description = "A powerful server for your applications",
  category = "Web",
  deployments = 0,
  imageUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
  compact = false,
}: ServerCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if server is saved when component mounts
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response = await fetch(`/api/saved-servers`);
        if (response.ok) {
          const savedServers = await response.json();
          const isSavedServer = savedServers.some(
            (server: any) => server.id === id,
          );
          setIsSaved(isSavedServer);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [id]);

  const handleNavigate = () => {
    router.push(`/dashboard/servers/${id}`);
  };

  const handleDeploy = () => {
    router.push(`/dashboard/deploy/configure?server=${id}`);
  };

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isSaved) {
        // Unsave the server
        const response = await fetch(`/api/saved-servers?server_id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to unsave server");
        }
      } else {
        // Save the server
        const response = await fetch("/api/saved-servers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ server_id: id }),
        });

        if (!response.ok) {
          throw new Error("Failed to save server");
        }
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save status:", error);
    }
  };

  if (compact) {
    return (
      <Card
        className="overflow-hidden border border-border hover:shadow-md transition-all cursor-pointer"
        onClick={handleNavigate}
      >
        <div className="flex p-4">
          <div className="flex-shrink-0 mr-4 w-16 h-16 rounded-md overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Server className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <CardTitle className="text-base truncate">{title}</CardTitle>
              <Badge variant="outline" className="ml-2 text-xs">
                {category}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-xs line-clamp-2">
              {description}
            </CardDescription>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Cloud className="h-3 w-3 mr-1" />
                <span>{deployments.toLocaleString()}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeploy();
                }}
              >
                Deploy
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-border hover:shadow-md transition-all">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Server className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/90">
          {category}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 left-2 h-8 w-8 rounded-full ${isSaved ? "text-red-500 bg-background/50 dark:bg-gray-800/50" : "text-muted-foreground bg-background/50 dark:bg-gray-800/50"}`}
          onClick={toggleSave}
        >
          <Heart className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Cloud className="h-4 w-4" />
          <span>{deployments.toLocaleString()} deployments</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleNavigate}>
          Details
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-500 text-white"
          onClick={handleDeploy}
        >
          Deploy
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
