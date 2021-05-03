import { Db, MongoClient } from 'mongodb'

const DB_URI = process.env.DB_URI  || 'mongodb://localhost:9700'
const DB_NAME = process.env.DB_NAME || 'tokpedstat'

export const client: MongoClient = new MongoClient(DB_URI, {useUnifiedTopology: true})
export let db: Db = undefined

export async function database(): Promise<Db>{
    if(db) return db
    else {
        await client.connect()
        db = client.db(DB_NAME)
        return db
    }
}