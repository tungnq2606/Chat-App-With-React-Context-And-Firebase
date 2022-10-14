import {Message, User, UserItemProps} from '../types';
import {Action, ActionType} from './action';

export type State = {
  user: User;
  messages: Array<Message>;
  users: Array<UserItemProps>;
  loading: boolean;
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case ActionType.LOGOUT:
      return {
        ...state,
        user: {
          id: '',
          displayName: '',
        },
        messages: [],
      };
    case ActionType.SHOW_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ActionType.HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };
    case ActionType.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case ActionType.ADD_MESSAGE:
      return {
        ...state,
        messages: [action.payload, ...state.messages],
      };
    case ActionType.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };

    case ActionType.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case ActionType.CLEAR_USERS:
      return {
        ...state,
        users: [],
      };

    default:
      return state;
  }
};
