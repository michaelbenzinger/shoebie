import { ADD_TO_CART, MODIFY_ITEM, DELETE_ITEM } from './types';

export const addToCart = item => dispatch => {
  dispatch({
    type: ADD_TO_CART,
    payload: item,
  });
};

export const modifyItem = (index, modification) => dispatch => {
  dispatch({
    type: MODIFY_ITEM,
    payload: {
      index,
      modification,
    },
  });
};

export const deleteItem = index => dispatch => {
  dispatch({
    type: DELETE_ITEM,
    payload: index,
  });
};
