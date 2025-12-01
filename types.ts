import * as SQLite from 'expo-sqlite';
export interface MapsMarker {
    id?: number;
    title: string;
    description: string;
    latitude: number,
    longitude: number,
    images?: string[];
}

export interface MarkerImage {
    id: string;
    markerId: number;
    uri: string;
    createdAt?: string;
}
export interface DatabaseContextType {
    db: SQLite.SQLiteDatabase | null;
    markers: MapsMarker[];
    // Статусы
    isLoading: boolean;
    error: Error | null;
    // Операции с базой данных
    refreshMarkers: () => Promise<void>;
    getMarkers: () => Promise<MapsMarker[]>;
    addMarker: (marker: MapsMarker) => Promise<void>;
    updateMarker: (id: number, title: string, description: string) => Promise<void>;
    deleteMarker: (id: number) => Promise<void>;
    getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
    addImage: (markerId: number, uri: string) => Promise<void>;
    deleteImage: (id: number) => Promise<void>;
}