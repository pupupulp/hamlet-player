import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Player from '../screens/Player';


const screens = createStackNavigator({
  Player,
}, {
  defaultNavigationOptions: {
    headerStyle: {},
    headerBackTitle: null,
    headerLeftContainerStyle: {},
    headerRightContainerStyle: {}
  }
});

export default createAppContainer(screens);
