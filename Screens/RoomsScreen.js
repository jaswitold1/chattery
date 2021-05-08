import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";

const RoomsScreen = (props) => {
  return (
    <View>
      <Button
        title='Room'
        onPress={() => {
          props.navigation.navigate({ routeName: "Chat" });
        }}
      />
    </View>
  );
};

export default RoomsScreen;

const styles = StyleSheet.create({});
