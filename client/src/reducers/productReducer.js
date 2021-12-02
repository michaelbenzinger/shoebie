import { SET_PRODUCT } from '../actions/types';

const initialState = {
  product: {},
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCT:
      return {
        ...state,
        product: action.payload,
      };
    default:
      return state;
  }
}
