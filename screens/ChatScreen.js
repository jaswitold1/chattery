import React from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://chat.thewidlarzgroup.com/api/graphql",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  query userRooms {
    user {
      firstName
    }
  }
`;

const Messages = (user) => {
  const { data } = useQuery(GET_MESSAGES);
  if (!data) {
    return null;
  }
  return JSON.stringify(data);
};

const ChatScreen = () => {
  return (
    <ApolloProvider>
      <SafeAreaView>
        <Messages user='Witold' />
      </SafeAreaView>
    </ApolloProvider>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
