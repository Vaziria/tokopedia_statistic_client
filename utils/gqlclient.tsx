import { ApolloClient, InMemoryCache } from '@apollo/client'

const gqlclient = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache()
})


export default gqlclient