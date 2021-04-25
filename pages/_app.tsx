import { ApolloProvider } from "@apollo/client"
import gqlclient from "../utils/gqlclient"

export default function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={gqlclient}>
        <Component {...pageProps} />
        </ApolloProvider>
    )
}