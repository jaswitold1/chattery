import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
  gql,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const RoomsScreen = (props) => {
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

  const GET_ROOMS = gql`
    {
      usersRooms {
        rooms {
          name
          id
        }
      }
    }
  `;

  const Rooms = ({ props }) => {
    const { loading, error, data } = useQuery(GET_ROOMS);

    if (loading) {
      return <Text>Loading</Text>;
    }
    if (error) {
      return <Text>Error! {error.message}</Text>;
    }
    if (data) {
      return data.usersRooms.rooms.map((el, i) => {
        return (
          <Button
            onPress={() => {
              props.navigation.navigate("Chat", { id: el.id });
            }}
            key={i}
            title={el.name}
          />
        );
      });
    }
  };
  return (
    <ApolloProvider client={client}>
      <Rooms props={props} />
    </ApolloProvider>
  );
};

export default RoomsScreen;

const styles = StyleSheet.create({});
