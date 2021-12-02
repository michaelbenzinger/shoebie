import { ADD_TO_CART, MODIFY_ITEM, DELETE_ITEM } from '../actions/types';

const initialState = {
  cart: [],
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      const matchingItem = state.cart.find(
        item =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (matchingItem) {
        matchingItem.quantity += 1;
        return {
          ...state,
          cart: [...state.cart],
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      }
    case MODIFY_ITEM:
      // If the modification is to the size
      if (Object.keys(action.payload.modification)[0] === 'size') {
        let matchingItem = state.cart.find(
          item =>
            item.size === action.payload.modification.size &&
            item.id === state.cart[action.payload.index].id
        );
        // An item of the same id and size already exists in the cart
        if (matchingItem) {
          // Add the matching item's quantity
          matchingItem.quantity += state.cart[action.payload.index].quantity;
          state.cart.splice(action.payload.index, 1);
          return {
            state,
            cart: [...state.cart],
          };
        }
      }
      Object.assign(
        state.cart[action.payload.index],
        action.payload.modification
      );

      return {
        state,
        cart: [...state.cart],
      };
    case DELETE_ITEM:
      state.cart.splice(action.payload, 1);
      return {
        state,
        cart: [...state.cart],
      };
    default:
      return state;
  }
}
