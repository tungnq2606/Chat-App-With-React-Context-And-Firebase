import {User} from '../types';

export enum ActionType {
  LOGIN,
  LOGOUT,
  SHOW_LOADING,
  HIDE_LOADING,
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

export type Action = Login | Logout | ShowLoading | HideLoading;
