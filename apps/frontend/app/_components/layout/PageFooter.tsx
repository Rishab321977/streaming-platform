"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export function PageFooter () {
    const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLastRefreshed(new Date().toLocaleDateString())
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <footer className="py-6 border-t mt-auto text-center text-sm text-muted-foreground">
            <div className="flex justify-center items-center gap-2">
                <span>Catalog Last Refreshed:</span>
                {lastRefreshed ? (
          <span className="font-mono text-primary">{lastRefreshed}</span>
        ) : (
          <Skeleton className="h-4 w-24" /> // Skeleton calculation logic
        )}
            </div>
        </footer>
    )
}