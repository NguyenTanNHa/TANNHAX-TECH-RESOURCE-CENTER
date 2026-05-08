import { useState, useEffect, useCallback } from "react";
import { ResourceItem } from "@/components/resources/ResourceCard";

export function useDriveResources() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/drive/folder");
      const json = await res.json();
      
      if (json.success) {
        setResources(json.data);
      } else {
        setError(json.message || "Failed to fetch resources");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/drive/revalidate", { method: "POST" });
      await fetchResources();
    } catch (err) {
      console.error("Failed to refresh cache");
      setIsLoading(false);
    }
  };

  return { resources, isLoading, error, refetch };
}
