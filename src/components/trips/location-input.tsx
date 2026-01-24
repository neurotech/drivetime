"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface LocationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onLocationSelect?: (location: string) => void;
}

let cachedLocations: string[] | null = null;

export const LocationInput = React.forwardRef<
  HTMLInputElement,
  LocationInputProps
>(({ onLocationSelect, ...props }, ref) => {
  const [suggestions, setSuggestions] = React.useState<string[]>(
    cachedLocations || [],
  );
  const [isLoading, setIsLoading] = React.useState(!cachedLocations);

  React.useEffect(() => {
    if (cachedLocations) {
      return;
    }

    async function fetchLocations() {
      try {
        const response = await fetch("/api/locations");
        if (response.ok) {
          const data = await response.json();
          const locations = data.locations || [];
          cachedLocations = locations;
          setSuggestions(locations);
        }
      } catch {
        // Silently fail - suggestions are not critical
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocations();
  }, []);

  const handleChipClick = (location: string) => {
    onLocationSelect?.(location);
  };

  return (
    <div className="space-y-2">
      <Input ref={ref} {...props} />
      {!isLoading && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => handleChipClick(location)}
              className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

LocationInput.displayName = "LocationInput";
