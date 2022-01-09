import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

let process = {
    env: {
        DB_CONN_STRING: "mongodb://localhost:27017",
        DB_NAME: "HomeOn",
        COLLECTION_NAME_list: "List", 
        COLLECTION_NAME_users: "users"
    }
}
export const collections: { list?: mongoDB.Collection, users?: mongoDB.Collection } = {}
export let List = {};
export async function connectToDatabase() {
    try 
    {
        dotenv.config();
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
        await client.connect();
        const db: mongoDB.Db = client.db(process.env.DB_NAME);
        const Collection_list: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME_list);
        collections.list = Collection_list;
        const Collection_users: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME_users);
        collections.users = Collection_users;
        //Pobranie listy z kolekcji
        List = await collections?.list?.find({}).toArray();
    }
    catch(err){console.log(err)}
}