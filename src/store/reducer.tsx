import {User} from '../types';
import {Action, ActionType} from './action';

export type State = {
  user: User;
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

    default:
      return state;
  }
};
