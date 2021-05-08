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
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const ChatScreen = (route) => {
  const httpLink = createHttpLink({
    uri: "https://chat.thewidlarzgroup.com/api/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaGF0bHkiLCJleHAiOjE2MjE1MDY3ODYsImlhdCI6MTYxOTA4NzU4NiwiaXNzIjoiY2hhdGx5IiwianRpIjoiMjIxZDExODUtOTI1NS00ZGVjLWJkMjYtYmYwZWNlZDc1MmMxIiwibmJmIjoxNjE5MDg3NTg1LCJzdWIiOiI0ZjIzNDY4Yi00ZGZkLTRkMmUtYTYwNC0wZjIwMjAxZTUyOGUiLCJ0eXAiOiJhY2Nlc3MifQ.a63UF8b_9IsXzPos54ZkZWohNnQd8aRbItvyDy8Dw507NNnjalHrvE3gvBQpKT029CDB8jyvO87F_FrgdZxHAg";
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const GET_MESSAGES = gql`
    {
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
    console.log(message);
    const handleInput = (text) => {
      setMessage(text);
    };
    const handleSend = () => {
      if (message.length > 0) {
      }
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
