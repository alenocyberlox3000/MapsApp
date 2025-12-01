import * as operations from '@/database/operations';
import { initDatabase, openDatabase } from "@/database/schema";
import { DatabaseContextType, MapsMarker } from "@/types";
import * as SQLite from 'expo-sqlite';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const useDatabase = (): DatabaseContextType => {
    const context = useContext(DatabaseContext);
    if (context === null) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
}

interface DatabaseProviderProps {
    children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [markers, setMarkers] = useState<MapsMarker[]>([]);

    useEffect(() => {
        const initializeDatabase = async () =>{
            try {
                const db = await openDatabase();
                await initDatabase();
                setDb(db);
                const allMarkers = await db.getAllAsync("SELECT * FROM markers");
                setMarkers(allMarkers as MapsMarker[]);
            } catch(err: any) {
                setError(err?.message ?? "Failed to initialize database");
            } finally {
                setIsLoading(false);
            }
        }
        
        initializeDatabase();

        return () => {
            if (db) {
                db.closeAsync();
            }
        };
    }, []);

    const refreshMarkers = async () => {
        if (db) {
            try {
                await operations.getMarkers().then(setMarkers);
            } catch (error) {
                setError(error as Error);
            }
        } else {
            setError( new Error("Database not initialized"))
        }
    }

    const getMarkers = async () => {
        if (db) {
            try {
                return await operations.getMarkers();
            } catch (error) {
                setError(error as Error);
                return [];
            }
        } else {
            setError( new Error("Database not initialized"))
            return [];
        }
    }

    const addMarker = async (marker: MapsMarker) => {
        if (db) {
            try {
                await operations.addMarker(marker);
                await refreshMarkers();
            } catch (error) {
                setError(error as Error);
            }
        } else {
            setError( new Error("Database not initialized"))
        }
    }

    const updateMarker = async (id: number, title: string, description: string) => {
        if (db) {
            try {
                await operations.updateMarker(id, title, description);
                await refreshMarkers();
            } catch (error) {
                setError(error as Error);
            }
        } else {
            setError( new Error("Database not initialized"))
        }
    }

    const deleteMarker = async (id: number) => {
        if (db) {
            try {
                await operations.deleteMarker(id);
                await refreshMarkers();
            } catch (error) {
                setError(error as Error);
            }
        } else {
            setError( new Error("Database not initialized"))
        }
    }

    const getMarkerImages = async (markerId: number) => {
        if (db) {
            try {
                return await operations.getMarkerImages(markerId);
            } catch (error) {
                setError(error as Error);
                return [];
            }
        } else {
            setError( new Error("Database not initialized"))
            return [];
        }
    }

    const addImage = async (markerId: number, uri: string) => {
        if (db) {
            try {
                await operations.addImage(markerId, uri);
            } catch (error) {
                setError(error as Error);
            }
        } else {
            setError( new Error("Database not initialized"))
        }
    }

    const deleteImage = async (id: number) => {
        if (db) {
            try {
                await operations.deleteImage(id);
            } catch (error) {
                setError(error as Error);
            }
        } else {
            setError( new Error("Database not initialized"))
        }
    }

    const contextValue: DatabaseContextType = {
        db,
        markers,
        isLoading,
        error,
        refreshMarkers,
        getMarkers,
        addMarker,
        updateMarker,
        deleteMarker,
        getMarkerImages,
        addImage,
        deleteImage,
    }

    return (
        <DatabaseContext.Provider value={contextValue}>
        {children}
        </DatabaseContext.Provider>
    );
};