import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
  gql,
  createHttpLink,
  useMutation,
  HttpLink,
  split,
  useSubscription,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";

import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { Socket as PhoenixSocket } from "phoenix";
import { hasSubscription } from "@jumpn/utils-graphql";

const ChatScreen = (route) => {
  console.log(route.navigation.state.params.id);
  const httpLink = createHttpLink({
    uri: "https://chat.thewidlarzgroup.com/api/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaGF0bHkiLCJleHAiOjE2MjE1MDY3ODYsImlhdCI6MTYxOTA4NzU4NiwiaXNzIjoiY2hhdGx5IiwianRpIjoiMjIxZDExODUtOTI1NS00ZGVjLWJkMjYtYmYwZWNlZDc1MmMxIiwibmJmIjoxNjE5MDg3NTg1LCJzdWIiOiI0ZjIzNDY4Yi00ZGZkLTRkMmUtYTYwNC0wZjIwMjAxZTUyOGUiLCJ0eXAiOiJhY2Nlc3MifQ.a63UF8b_9IsXzPos54ZkZWohNnQd8aRbItvyDy8Dw507NNnjalHrvE3gvBQpKT029CDB8jyvO87F_FrgdZxHAg";

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const authedHttpLink = authLink.concat(httpLink);

  const phoenixSocket = new PhoenixSocket(
    "wss://chat.thewidlarzgroup.com/socket",
    {
      params: () => {
        return {
          token:
            "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaGF0bHkiLCJleHAiOjE2MjE1MDY3ODYsImlhdCI6MTYxOTA4NzU4NiwiaXNzIjoiY2hhdGx5IiwianRpIjoiMjIxZDExODUtOTI1NS00ZGVjLWJkMjYtYmYwZWNlZDc1MmMxIiwibmJmIjoxNjE5MDg3NTg1LCJzdWIiOiI0ZjIzNDY4Yi00ZGZkLTRkMmUtYTYwNC0wZjIwMjAxZTUyOGUiLCJ0eXAiOiJhY2Nlc3MifQ.a63UF8b_9IsXzPos54ZkZWohNnQd8aRbItvyDy8Dw507NNnjalHrvE3gvBQpKT029CDB8jyvO87F_FrgdZxHAg",
        };
      },
    }
  );

  const absintheSocket = AbsintheSocket.create(phoenixSocket);

  const websocketLink = createAbsintheSocketLink(absintheSocket);

  const link = split(
    (operation) => hasSubscription(operation.query),
    websocketLink,
    authedHttpLink
  );

  const cache = new InMemoryCache();

  const client = new ApolloClient({
    link,
    cache,
  });

  const GET_MESSAGES = gql`
    query x {
   
      room(id: "${route.navigation.state.params.id}") {
        messages {
          body
          id
           user {
            firstName
          }
         
        }
      }
    }
  `;
  const SEND_MESSAGES = gql`
    mutation($body: String!) {
      sendMessage(body: $body, roomId: "${route.navigation.state.params.id}") {
        body
      }
    }
  `;

  //// pobieranie wiadomosci
  const Messages = () => {
    const { data } = useQuery(GET_MESSAGES);

    if (!data) {
      return <Text>Nie ma</Text>;
    }
    if (data) {
      return data.room.messages.map((el, i) => {
        return (
          <Text
            style={
              el.user.firstName == "witold"
                ? { alignItems: "flex-start" }
                : { alignItems: "flex-end" }
            }
            key={el.id}
          >
            {el.body}
          </Text>
        );
      });
    }
  };
  ////// wysylanie
  const MessageInput = () => {
    const [message, setMessage] = useState({});
    const [sendMessage] = useMutation(SEND_MESSAGES);

    const handleInput = (text) => {
      setMessage(text);
    };
    const handleSend = () => {
      if (message.length > 0)
        sendMessage({
          variables: { body: message },
        });
      setMessage({});
    };
    return (
      <SafeAreaView style={{ display: "flex", flexDirection: "row" }}>
        <TextInput
          style={{ borderWidth: 1, borderColor: "black", flex: 2 }}
          onChangeText={(text) => handleInput(text)}
        />
        <Button onPress={handleSend} title='Send' />
      </SafeAreaView>
    );
  };
  return (
    <ApolloProvider client={client}>
      <SafeAreaView
        style={{ flex: 1, display: "flex", justifyContent: "space-between" }}
      >
        <Messages style={styles.messages} />
        <MessageInput />
      </SafeAreaView>
    </ApolloProvider>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  messages: {
    display: "flex",
  },
});
