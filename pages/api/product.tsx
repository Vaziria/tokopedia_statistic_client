import type { NextApiRequest, NextApiResponse } from 'next'
import { database } from '../../database'

export default async function product(req: NextApiRequest, res: NextApiResponse) {
    const db = await database()
    const hasil = await db.collection('product').find({ sold_week: {$gte: 30} }).limit(10).toArray()

    res.status(200).json(hasil)
}