import Database from "better-sqlite3";
import {config} from "@/config";

function createConnection(){
    const db = new Database(config.db.sqlite.path, {
        verbose: console.log,
    });

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('cache_size = -20000');
    db.pragma('synchronous = NORMAL');
    db.pragma('automatic_index = ON');
    return db
}

export const db = createConnection()
export type DB = typeof db