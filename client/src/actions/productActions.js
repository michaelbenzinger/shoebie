import { SET_PRODUCT, UPDATE_PRODUCTS } from './types';

export const setProduct = product => dispatch => {
  dispatch({
    type: SET_PRODUCT,
    payload: product,
  });
};

export const updateProducts = products => dispatch => {
  dispatch({
    type: UPDATE_PRODUCTS,
    payload: products,
  });
};
