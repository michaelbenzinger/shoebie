import { ADD_TO_CART } from './types';

export const addToCart = item => dispatch => {
  console.log(item);
  dispatch({
    type: ADD_TO_CART,
    payload: item,
  });
};
