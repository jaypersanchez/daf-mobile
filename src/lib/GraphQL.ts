import { ApolloClient, Resolvers } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { from } from "apollo-link";
import apolloLogger from "apollo-link-logger";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

// const httpLink = new HttpLink({uri: '/graphql'})

const ErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL Error] Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error] ${networkError}`);
});

const link = from([
  ErrorLink,
  apolloLogger
  // httpLink,
]);

const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    log: (_, { type, message, category }, { cache }) => {
      const query = gql`
        query getLogs {
          logs @client {
            id
            timestamp
            type
            category
            message
          }
        }
      `;

      const previous = cache.readQuery({ query });
      const timestamp = new Date().getTime() / 1000;
      const logItemitem = {
        id: `LogMessage:${timestamp}`,
        timestamp,
        type,
        message,
        category,
        __typename: "LogMessage"
      };
      const data = {
        logs: [logItemitem, ...previous.logs]
      };

      console.log(data);
      cache.writeQuery({ query, data });
      return logItemitem;
    }
  }
};

export const cache = new InMemoryCache();
export const client = new ApolloClient({
  connectToDevTools: true,
  typeDefs: gql`
    type LogMessage {
      id: ID!
      timestamp: Int
      type: Int
      message: String
      category: String
    }
    extend type Query {
      logs: [LogMessage!]
    }
  `,
  cache,
  link,
  resolvers
});

cache.writeData({
  data: {
    logs: []
  }
});
