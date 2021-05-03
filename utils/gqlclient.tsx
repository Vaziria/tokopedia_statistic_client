import { ApolloClient, InMemoryCache } from '@apollo/client'

const GQL_CLIENT = process.env.GQL_CLIENT

const gqlclient = new ApolloClient({
  uri: GQL_CLIENT,
  cache: new InMemoryCache()
})


export default gqlclient