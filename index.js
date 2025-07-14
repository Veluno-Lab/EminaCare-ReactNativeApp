import { AppRegistry } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import AppNavigator from './src/navigations/AppNavigator';
import theme from './src/theme/theme';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => () => (
  <NativeBaseProvider theme={theme}>
    <AppNavigator />
  </NativeBaseProvider>
));