export interface MapsMarker {
    id: string;
    title: string;
    description: string;
    coordinate: {
        latitude: number,
        longitude: number,
    }
    images?: string[];
}