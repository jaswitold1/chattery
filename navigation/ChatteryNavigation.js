import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import ChatScreen from "../Screens/ChatScreen";
import RoomsScreen from "../Screens/RoomsScreen";

const ChatteryNavigator = createStackNavigator({
  Rooms: RoomsScreen,
  Chat: ChatScreen,
});

export default createAppContainer(ChatteryNavigator);
