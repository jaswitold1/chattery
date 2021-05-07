import React from "react";
import { StyleSheet, Button, Text, View, SafeAreaView } from "react-native";

const RoomsScreen = (props) => {
  return (
    <SafeAreaView>
      <Button
        title='chatroom'
        onPress={() => {
          props.navigation.navigate({ routeName: "Chat" });
        }}
      />
    </SafeAreaView>
  );
};

export default RoomsScreen;

const styles = StyleSheet.create({});
