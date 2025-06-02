"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

export interface ServerData {
  id: string;
  title: string;
  description: string;
  category: string;
  deployments: number;
  imageUrl: string;
  specs?: {
    cpu: string;
    memory: string;
    storage: string;
    network: string;
    os: string;
  };
  features?: string[];
  providers?: {
    name: string;
    regions: string[];
  }[];
  author?: string;
  rating?: number;
  icon?: string;
  downloads?: string;
  status?: string;
  lastUpdated?: string;
  githubUrl?: string;
  githubStars?: number;
  githubForks?: number;
}

// Mock data for servers
const mockServers: ServerData[] = [
  {
    id: "web-server-pro",
    title: "Web Server Pro",
    description: "High-performance web server with nginx and PHP support",
    category: "Web",
    deployments: 1245,
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
    specs: {
      cpu: "4 vCPUs",
      memory: "8 GB RAM",
      storage: "100 GB SSD",
      network: "1 Gbps",
      os: "Ubuntu 22.04 LTS",
    },
    features: [
      "Pre-configured Nginx web server",
      "PHP 8.2 with common extensions",
      "MariaDB database",
      "Let's Encrypt SSL integration",
      "Automatic security updates",
      "Web-based control panel",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "TempoLabs",
    rating: 4.8,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=webserver",
    downloads: "1245",
    status: "Verified",
    lastUpdated: "2023-12-15",
  },
  {
    id: "database-cluster",
    title: "Database Cluster",
    description: "Scalable PostgreSQL database cluster with automatic failover",
    category: "Database",
    deployments: 876,
    imageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80",
    specs: {
      cpu: "8 vCPUs",
      memory: "16 GB RAM",
      storage: "500 GB SSD",
      network: "10 Gbps",
      os: "Debian 11",
    },
    features: [
      "High-availability PostgreSQL cluster",
      "Automatic failover",
      "Point-in-time recovery",
      "Automated backups",
      "Connection pooling",
      "Advanced monitoring",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "DatabasePro",
    rating: 4.6,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=database",
    downloads: "876",
    status: "Verified",
    lastUpdated: "2023-11-20",
  },
  {
    id: "nodejs-runtime",
    title: "Node.js Runtime",
    description:
      "Optimized Node.js environment for modern JavaScript applications",
    category: "Runtime",
    deployments: 2103,
    imageUrl:
      "https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=400&q=80",
    specs: {
      cpu: "2 vCPUs",
      memory: "4 GB RAM",
      storage: "50 GB SSD",
      network: "1 Gbps",
      os: "Alpine Linux",
    },
    features: [
      "Node.js 18 LTS",
      "NPM and Yarn package managers",
      "Automatic scaling",
      "Built-in monitoring",
      "HTTPS support",
      "CI/CD integration",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "NodeMaster",
    rating: 4.9,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=nodejs",
    downloads: "2103",
    status: "Verified",
    lastUpdated: "2024-01-05",
    githubUrl: "https://github.com/nodejs/node",
    githubStars: 98500,
    githubForks: 26700,
  },
  {
    id: "ai-development-kit",
    title: "AI Development Kit",
    description: "Complete environment for AI/ML model training and deployment",
    category: "AI/ML",
    deployments: 543,
    imageUrl:
      "https://images.unsplash.com/photo-1677442135136-760c813029fb?w=400&q=80",
    specs: {
      cpu: "16 vCPUs",
      memory: "64 GB RAM",
      storage: "1 TB SSD",
      network: "25 Gbps",
      os: "Ubuntu 22.04 LTS",
    },
    features: [
      "Pre-installed TensorFlow, PyTorch, and scikit-learn",
      "CUDA support for GPU acceleration",
      "Jupyter Notebook environment",
      "Model serving infrastructure",
      "Distributed training support",
      "MLOps tools integration",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2"] },
      { name: "Azure", regions: ["eastus", "westeurope"] },
      { name: "GCP", regions: ["us-central1", "europe-west1"] },
    ],
    author: "AIResearch",
    rating: 4.7,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=ai",
    downloads: "543",
    status: "Verified",
    lastUpdated: "2023-12-28",
    githubUrl: "https://github.com/tensorflow/tensorflow",
    githubStars: 178000,
    githubForks: 88000,
  },
  {
    id: "kubernetes-cluster",
    title: "Kubernetes Cluster",
    description:
      "Pre-configured Kubernetes cluster for container orchestration",
    category: "Container",
    deployments: 789,
    imageUrl:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&q=80",
    specs: {
      cpu: "8 vCPUs",
      memory: "32 GB RAM",
      storage: "200 GB SSD",
      network: "10 Gbps",
      os: "Container-optimized OS",
    },
    features: [
      "Kubernetes 1.26",
      "Auto-scaling node groups",
      "Integrated load balancing",
      "Persistent volume support",
      "Helm package manager",
      "Prometheus monitoring",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "K8sMaster",
    rating: 4.5,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=kubernetes",
    downloads: "789",
    status: "Verified",
    lastUpdated: "2023-11-15",
    githubUrl: "https://github.com/kubernetes/kubernetes",
    githubStars: 102000,
    githubForks: 37500,
  },
  {
    id: "redis-cache",
    title: "Redis Cache",
    description:
      "High-performance in-memory data store for caching and messaging",
    category: "Database",
    deployments: 1567,
    imageUrl:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80",
    specs: {
      cpu: "2 vCPUs",
      memory: "8 GB RAM",
      storage: "20 GB SSD",
      network: "5 Gbps",
      os: "Alpine Linux",
    },
    features: [
      "Redis 7.0",
      "Persistence options",
      "Cluster mode",
      "Pub/Sub messaging",
      "Lua scripting",
      "Advanced data structures",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "CacheExpert",
    rating: 4.4,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=redis",
    downloads: "1567",
    status: "Verified",
    lastUpdated: "2023-10-30",
    githubUrl: "https://github.com/redis/redis",
    githubStars: 60000,
    githubForks: 24000,
  },
  {
    id: "mern-stack",
    title: "MERN Stack",
    description:
      "Complete MongoDB, Express, React, and Node.js development environment",
    category: "Web",
    deployments: 1823,
    imageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
    specs: {
      cpu: "4 vCPUs",
      memory: "8 GB RAM",
      storage: "100 GB SSD",
      network: "1 Gbps",
      os: "Ubuntu 22.04 LTS",
    },
    features: [
      "MongoDB database",
      "Express.js backend",
      "React frontend",
      "Node.js runtime",
      "Development tools pre-installed",
      "Sample application included",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "WebDevPro",
    rating: 4.7,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=mern",
    downloads: "1823",
    status: "Verified",
    lastUpdated: "2024-01-10",
    githubUrl: "https://github.com/mongodb/mongo",
    githubStars: 24000,
    githubForks: 5200,
  },
  {
    id: "django-python",
    title: "Django Python",
    description:
      "Production-ready Django environment for Python web applications",
    category: "Web",
    deployments: 1342,
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&q=80",
    specs: {
      cpu: "2 vCPUs",
      memory: "4 GB RAM",
      storage: "50 GB SSD",
      network: "1 Gbps",
      os: "Debian 11",
    },
    features: [
      "Django 4.2 LTS",
      "Python 3.11",
      "PostgreSQL database",
      "Gunicorn WSGI server",
      "Nginx reverse proxy",
      "Celery task queue",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "PythonDev",
    rating: 4.6,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=django",
    downloads: "1342",
    status: "Verified",
    lastUpdated: "2023-12-05",
    githubUrl: "https://github.com/django/django",
    githubStars: 70000,
    githubForks: 29000,
  },
  {
    id: "laravel-php",
    title: "Laravel PHP",
    description: "Modern PHP web application framework with all the essentials",
    category: "Web",
    deployments: 1654,
    imageUrl:
      "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=400&q=80",
    specs: {
      cpu: "2 vCPUs",
      memory: "4 GB RAM",
      storage: "50 GB SSD",
      network: "1 Gbps",
      os: "Ubuntu 22.04 LTS",
    },
    features: [
      "Laravel 10",
      "PHP 8.2",
      "MySQL database",
      "Redis for caching",
      "Composer package manager",
      "Laravel Horizon",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "PHPMaster",
    rating: 4.5,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=laravel",
    downloads: "1654",
    status: "Verified",
    lastUpdated: "2023-11-25",
    githubUrl: "https://github.com/laravel/laravel",
    githubStars: 73000,
    githubForks: 23500,
  },
  {
    id: "spring-boot-java",
    title: "Spring Boot Java",
    description: "Enterprise-grade Java application server with Spring Boot",
    category: "Web",
    deployments: 1245,
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80",
    specs: {
      cpu: "4 vCPUs",
      memory: "8 GB RAM",
      storage: "100 GB SSD",
      network: "1 Gbps",
      os: "Ubuntu 22.04 LTS",
    },
    features: [
      "Spring Boot 3.0",
      "Java 17 LTS",
      "PostgreSQL database",
      "Maven build tool",
      "Spring Security",
      "Spring Data JPA",
    ],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: "JavaExpert",
    rating: 4.4,
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=spring",
    downloads: "1245",
    status: "Verified",
    lastUpdated: "2023-12-10",
    githubUrl: "https://github.com/spring-projects/spring-boot",
    githubStars: 68000,
    githubForks: 42000,
  },
];

export function useServers() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [filteredServers, setFilteredServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Get all available categories from servers
  const categories = Array.from(
    new Set(mockServers.map((server) => server.category)),
  );

  // Fetch servers from API
  const fetchServers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (activeFilters.length > 0) {
        params.append("category", activeFilters[0]);
      }

      // Try to fetch from database first
      try {
        const response = await fetch(`/api/servers?${params.toString()}`);

        if (response.ok) {
          const data = await response.json();

          // If we have data from the database, use it
          if (data && data.length > 0) {
            setServers(data);
            setFilteredServers(data);
            setLoading(false);
            return;
          }
        } else if (response.status === 401) {
          // User not authenticated, use mock data
          console.log("User not authenticated, using mock data");
          setServers(mockServers);
          setFilteredServers(mockServers);
          setLoading(false);
          return;
        }
      } catch (dbError) {
        console.warn("Database fetch failed:", dbError);
      }

      // If no data from database, try GitHub as fallback
      console.log("No servers found in database, trying GitHub...");
      try {
        const githubResponse = await fetch(
          `/api/github/servers?${params.toString()}`,
        );

        if (githubResponse.ok) {
          const githubData = await githubResponse.json();

          if (githubData && githubData.length > 0) {
            console.log("Found servers from GitHub");
            setServers(githubData);
            setFilteredServers(githubData);
            setLoading(false);
            return;
          }
        }
      } catch (githubErr) {
        console.warn("Error fetching from GitHub:", githubErr);
      }

      // If both database and GitHub fail, use mock data as final fallback
      console.log("Using mock data as fallback");
      setServers(mockServers);
      setFilteredServers(mockServers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching servers:", err);
      setError("Failed to fetch servers");

      // Fallback to mock data in case of error
      setServers(mockServers);
      setFilteredServers(mockServers);
      setLoading(false);
    }
  };

  // Filter servers based on search query and active filters
  const filterServers = () => {
    let filtered = [...servers];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (server) =>
          server.title.toLowerCase().includes(query) ||
          server.description.toLowerCase().includes(query) ||
          server.category.toLowerCase().includes(query),
      );
    }

    // Apply category filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((server) =>
        activeFilters.includes(server.category),
      );
    }

    setFilteredServers(filtered);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter change
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  // Get a server by ID
  const getServerById = (id: string): ServerData | undefined => {
    return servers.find((server) => server.id === id);
  };

  // Initial fetch
  useEffect(() => {
    fetchServers();
  }, []);

  // Apply filters when search query or active filters change
  useEffect(() => {
    filterServers();
  }, [searchQuery, activeFilters, servers]);

  return {
    servers: filteredServers,
    loading,
    error,
    categories,
    handleSearch,
    handleFilterChange,
    getServerById,
    refreshServers: fetchServers,
  };
}
