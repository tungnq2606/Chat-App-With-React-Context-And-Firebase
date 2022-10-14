import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  LoginScreen,
  GiftedChatScreen,
  RegisterScreen,
  GiftedChatListScreen,
  NewChatScreen,
} from '../screens';
import Provider from '../store/provider';
import {AppLoading} from '../components';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  GiftedChat: {
    chatId?: string;
    partnerName: string;
    color: string | undefined;
    partnerId: string;
  };
  GiftedChatList: undefined;
  NewChat: undefined;
};

const StackNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="GiftedChat" component={GiftedChatScreen} />
          <Stack.Screen
            name="GiftedChatList"
            component={GiftedChatListScreen}
          />
          <Stack.Screen
            name="NewChat"
            component={NewChatScreen}
            options={{
              gestureDirection: 'vertical',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <AppLoading />
    </Provider>
  );
};

export default StackNavigation;
