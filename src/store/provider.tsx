import React, {createContext, useReducer} from 'react';
import {Action} from './action';
import {reducer, State} from './reducer';

interface Props {
  children: JSX.Element | JSX.Element[];
}

interface ContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
export const Context = createContext<ContextProps>({
  state: {} as State,
  dispatch: () => null,
});

const initialState: State = {
  user: {
    username: 'Test',
    password: '123',
  },
  loading: false,
};

const Provider = ({children}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
  );
};

export default Provider;
