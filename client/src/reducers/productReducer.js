import { SET_PRODUCT, UPDATE_PRODUCTS } from '../actions/types';

const initialState = {
  product: {},
  products: [],
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCT:
      return {
        ...state,
        product: action.payload,
      };
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
}
