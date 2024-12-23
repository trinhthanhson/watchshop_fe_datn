import {
  GET_ALL_UPDATE_PRICE_FAILURE,
  GET_ALL_UPDATE_PRICE_SUCCESS
} from '../../../actions/inventory/product/type'

const initialState = {
  all_price: [],
  error: null
}

const getAllPriceProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_UPDATE_PRICE_SUCCESS:
      return {
        ...state,
        all_price: action.payload,
        error: null
      }
    case GET_ALL_UPDATE_PRICE_FAILURE:
      return {
        ...state,
        all_price: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default getAllPriceProductReducer
