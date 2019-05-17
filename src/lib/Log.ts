import gql from "graphql-tag";
import { cache, client } from "./GraphQL";

export enum LogMessageType {
  Info,
  Warning,
  Error
}

export interface LogMessage {
  id: string;
  type: LogMessageType;
  category?: string;
  message: string;
  timestamp: number;
  __typename?: string;
}

export const getLogsQuery = gql`
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

const newLogItemMutation = gql`
  mutation newLogItem($message: String!, $type: Int!, $category: String) {
    log(message: $message, type: $type, category: $category) @client
  }
`;

const writeLogItemToCache = (
  message: string,
  type: LogMessageType,
  category?: string
) => {
  client.mutate({
    mutation: newLogItemMutation,
    variables: {
      message,
      type,
      category
    },
    refetchQueries: ["getLogs"]
  });
};

export default {
  info: (message: string, category?: string) => {
    console.log(category && `[${category}]`, message);
    writeLogItemToCache(message, LogMessageType.Info, category);
  },

  warning: (message: string, category?: string) => {
    console.log(category && `[${category}]`, "⚠️ Warning:", message);
    writeLogItemToCache(message, LogMessageType.Warning, category);
  },

  error: (message: string, category?: string) => {
    console.log(category && `[${category}]`, "🛑 Error:", message);
    writeLogItemToCache(message, LogMessageType.Error, category);
  }
};
