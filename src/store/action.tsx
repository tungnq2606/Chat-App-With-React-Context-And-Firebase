import {Message, User} from '../types';

export enum ActionType {
  LOGIN,
  LOGOUT,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_MESSAGES,
  ADD_MESSAGE,
  CLEAR_MESSAGES,
}

export interface Login {
  type: ActionType.LOGIN;
  payload: User;
}

export interface Logout {
  type: ActionType.LOGOUT;
}

export interface ShowLoading {
  type: ActionType.SHOW_LOADING;
}

export interface HideLoading {
  type: ActionType.HIDE_LOADING;
}

export interface SetMessages {
  type: ActionType.SET_MESSAGES;
  payload: Array<Message>;
}

export interface AddMessage {
  type: ActionType.ADD_MESSAGE;
  payload: Message;
}

export interface ClearMessages {
  type: ActionType.CLEAR_MESSAGES;
}

export type Action =
  | Login
  | Logout
  | ShowLoading
  | HideLoading
  | SetMessages
  | AddMessage
  | ClearMessages;
