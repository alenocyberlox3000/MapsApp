import { MapsMarker, MarkerImage } from '@/types';
import { openDatabase } from './schema';

export const getMarkers = async (): Promise<MapsMarker[]> => {
    try {
        const db = await openDatabase();
        const markers = await db.getAllAsync('SELECT * FROM markers') as MapsMarker[];
        return markers;
    } catch (error) {
        console.log("Ошибка при получении маркеров: ", error);
        throw error;
    }
}

export const addMarker = async (marker: MapsMarker): Promise<void> => {
    try {
        const db = await openDatabase();
        await db.runAsync('INSERT INTO markers (title, description, latitude, longitude) VALUES (?, ?, ?, ?)', [marker.title, marker.description, marker.latitude, marker.longitude]);
    } catch (error) {
        console.log("Ошибка при добавлении маркера: ", error);
        throw error;
    }
}

export const updateMarker = async (id: number, title: string, description: string): Promise<void> => {
    try {
        const db = await openDatabase();
        await db.runAsync('UPDATE markers SET title = ?, description = ? WHERE id = ?', [title, description, id]);
    } catch (error) {
        console.log("Ошибка при обновлении данных маркера: ", error);
        throw error;
    }
}

export const deleteMarker = async (id: number): Promise<void> => {
    try {
        const db = await openDatabase();
        await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
    } catch (error) {
        console.log("Ошибка при удалении маркера: ", error);
        throw error;
    }
}

export const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
    try {
        const db = await openDatabase();
        const images = await db.getAllAsync('SELECT * FROM marker_images WHERE marker_id = ?', [markerId]) as MarkerImage[];
        return images;
    } catch (error) {
        console.log("Ошибка при получении изображений маркера: ", error);
        throw error;
    }
}

export const addImage = async (markerId: number, uri: string): Promise<void> => {
    try {
        const db = await openDatabase();
        await db.runAsync('INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)', [markerId, uri]);
    } catch (error) {
        console.log("Ошибка при добавлении изображения: ", error);
        throw error;
    }
}

export const deleteImage = async (id: number): Promise<void> => {
    try {
        const db = await openDatabase();
        await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
    } catch (error) {
        console.log("Ошибка при удалении изображения: ", error);
        throw error;
    }
}
