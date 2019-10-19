import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./HomeScreen";
import StartScreen from "./StartScreen";
import SatellitePage from "./SatellitePage";

const MainNavigator = createStackNavigator(
  {
    Start: {
      screen: StartScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        title: `Home`,
        headerLeft: null
      })
    },
    Satellite: {
        screen: SatellitePage,
        navigationOptions: () => ({
            title: `Satellite`
        })
    }
  },
  {
    initialRouteName: "Start"
  }
);

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;
