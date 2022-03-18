import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import type { Group } from "../common/types";

export async function getDatabase() {
    dotenv.config();
    const databaseName = process.env.DATABASE_NAME ?? "HomeON";
    const client = new MongoClient(
        process.env.DATABASE_CONNECTION_STRING ?? "mongodb://localhost:27017"
    );
    await client.connect();
    const database = client.db(databaseName);
    return {
        users: database.collection<User>("users"),
        groups: database.collection<Group>("groups"),
        lastId: database.collection<{ id: number }>("lastId"),
    };
}

type User = {
    login: string;
    password: string;
    email: string;
    confirmEmailToken?: string;
    groups: string[];
    position: { x: number; y: number };
    time: number;
    street: string;
};

export type Database = Awaited<ReturnType<typeof getDatabase>>;
