import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

let process = {
    env: {
        DB_CONN_STRING: "mongodb://localhost:27017",
        DB_NAME: "HomeON",
    },
};

export async function getDatabase() {
    dotenv.config();
    const client = new MongoClient(process.env.DB_CONN_STRING);
    await client.connect();
    const database = client.db(process.env.DB_NAME);
    return {
        list: database.collection("list"),
        users: database.collection("users"),
        groups: database.collection("groups"),
        plans: database.collection("plans"),
    };
}
