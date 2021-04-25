import { ApolloServer, gql } from "apollo-server-micro"
import Cors from "micro-cors"
import { Db } from "mongodb"
import { database } from "../../database"

const typeDefs = gql`

  type Query {
    hello: String!
    products(search: String!): [Product]
  }
  
  type Product {
    _id: ID!
    name: String!
    url: String!
    images: [String]!
    price: String!
  }
  
  `


interface Context {
  db: Db
}

interface ProductFilter {
  search?: string
}

const resolvers = {
  Query: {
    hello: (_parent, _args, context: Context) => "Hello!",
    products: async (parent, args: ProductFilter, context: Context) => {
      const { db }  = context

      const query = {}
      if(args.search !== ''){
        query['$text'] = { $search: `\"${args.search}\"` }
      }

      const hasil = await db.collection('product').find(query).limit(30).toArray()
      
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