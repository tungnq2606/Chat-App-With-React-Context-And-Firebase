import {useContext} from 'react';
import {Context} from '../store/provider';

export const useUser = () => {
  const {state, dispatch} = useContext(Context);

  return {state, dispatch};
};
