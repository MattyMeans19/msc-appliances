'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
    isLoading: boolean;
    loadingMessage: string;
    startLoading: (message?: string) => void;
    stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const pathname = usePathname();

const startLoading = (message: string = "Loading...") => {
    // If the user clicks the link for the page they are already on, 
    // don't trigger the loader, or set a timeout to clear it.
    setIsLoading(true);
    setLoadingMessage(message);

    // Safety timeout: If navigation doesn't happen in 3 seconds, clear it.
    setTimeout(() => setIsLoading(false), 3000); 
};

    const stopLoading = () => setIsLoading(false);

    // Auto-stop loading whenever the route changes successfully
    useEffect(() => {
        stopLoading();
    }, [pathname]);

    return (
        <LoadingContext.Provider value={{ isLoading, loadingMessage, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used within a LoadingProvider");
    return context;
};