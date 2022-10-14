import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/stack-navigation';

export type GiftedChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GiftedChat'
>;

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

export type GiftedChatListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GiftedChatList'
>;

export type NewChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NewChat'
>;
