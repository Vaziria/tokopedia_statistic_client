import { ApolloServer, gql } from "apollo-server-micro"
import Cors from "micro-cors"
import { Db } from "mongodb"
import { database } from "../../database"

const typeDefs = gql`

  input ProductFilter {
    search: String
    limit: Int
    cat_level: Int
    cat_id: String
    pmin: Int
    pmax: Int
    sort: String
    offset: Int
    desc: Boolean
    shop_rating: Int
  }

  type Query {
    hello: String!
    products(filter: ProductFilter!): [Product]
    product_count: Int!
  }

  type Shop {
    rating: Float
    location: String
  }
  
  type Product {
    _id: ID!
    name: String!
    url: String!
    images: [String]!
    price: String!
    cat_id_1: String
    cat_id_2: String
    cat_id_3: String
    stock: Int

    shop: Shop
    diff_tx: [[Int]]
    diff_sold: [[Int]]
    diff_view: [[Int]]

    sold_day_1: Int
    sold_day_3: Int
    sold_week: Int
    sold_week_2: Int
    sold_month: Int

    tx_day_1: Int
    tx_day_3: Int
    tx_week: Int
    tx_week_2: Int
    tx_month: Int

    view_day_1: Int
    view_day_3: Int
    view_week: Int
    view_week_2: Int
    view_month: Int

  }
  
  `


interface Context {
  db: Db
}

interface ProductFilter {
  search: string
  limit: number
  pmin: number
  pmax: number
  offset: number
  cat_level: number
  cat_id: string
  sort: string
  desc: boolean
  shop_rating: number
}

const resolvers = {
  Query: {
    hello: (_parent, _args, context: Context) => "Hello!",
    product_count: async (parent, args, context: Context) => {
      const { db }  = context
      // return await db.collection('product').countDocuments({})
      return 0
    },
    products: async (parent, args: { filter: Partial<ProductFilter> }, context: Context) => {
      const { db }  = context
      const { filter } = args
      
      // getting limit
      let { limit } = filter
      if (limit && limit > 30) {
        limit = 30
      }

      const query_fill = []

      // filter search
      const query = {}
      if(filter.search !== ''){
        query_fill.push({
          $text: { $search: `\"${filter.search}\"` }
        })
      }

      // filtering price
      const { pmin, pmax } = filter
      if(pmin){
        query_fill.push({
          price: {
            $gte: pmin
          }
        })
      }
      if(pmax){
        query_fill.push({
          price: {
            $lte: pmax
          }
        })
      }

      // filtering kategori
      const { cat_level, cat_id } = filter
      let key = `cat_id_1`

      if(cat_level){
        key = `cat_id_${cat_level}`
      }
      if(cat_id){
        const catquery = {}
        catquery[key] = cat_id
        query_fill.push(catquery)
      }

      // filter rating
      const { shop_rating } = filter
      if(shop_rating){
        query_fill.push({
          "shop.rating": {
            $gte: shop_rating
          }
        })
      }

      // adding query and
      if(query_fill.length > 0){
        query['$and'] = query_fill
      }

      // adding sorting data
      const { desc, sort } = filter
      let sortobj: any = { 'sold_week': -1 }
      if(sort){
        sortobj = {}
        if(desc == false){
          sortobj[sort] = 1
        } else {
          sortobj[sort] = -1
        }
          
      }

      // hitungan offset
      let { offset } = filter
      if(!offset){
        offset = 0
      }

      console.log(sortobj)
      const hasil = await db.collection('product').find(query).skip(offset).sort(sortobj).limit(limit).toArray()
      
      return hasil

    }
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const db = await database()
    return { db };
  }
});

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false
  }
};




const cors = Cors({
  allowMethods: ["POST", "OPTIONS"]
})

export default cors(handler)