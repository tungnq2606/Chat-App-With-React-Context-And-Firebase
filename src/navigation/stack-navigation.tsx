import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {LoginScreen, GiftedChatScreen, RegisterScreen} from '../screens';
import Provider from '../store/provider';
import {AppLoading} from '../components';

const StackNavigation: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="GiftedChat" component={GiftedChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <AppLoading />
    </Provider>
  );
};

export default StackNavigation;
