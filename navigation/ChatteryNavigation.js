import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import ChatScreen from "../screens/ChatScreen";
import RoomsScreen from "../screens/RoomsScreen";

const ChatteryNavigator = createStackNavigator({
  Rooms: RoomsScreen,
  Chat: ChatScreen,
});

export default createAppContainer(ChatteryNavigator);
