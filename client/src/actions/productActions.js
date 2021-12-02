import { SET_PRODUCT } from './types';

export const setProduct = product => dispatch => {
  dispatch({
    type: SET_PRODUCT,
    payload: product,
  });
};
