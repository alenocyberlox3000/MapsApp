import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (!db){
        db = await SQLite.openDatabaseAsync('markers.db');
        console.log('База данных подключена');
    }
    return db;
}

export const initDatabase = async () => {
    try {
        const db = await openDatabase();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS markers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS marker_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            marker_id INTEGER NOT NULL,
            uri TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
            );`
        );
        return db;
    } catch (error) {
        console.error('Database not initialized:', error);
    }
};