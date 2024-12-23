import {
  GET_PRICE_BY_PRODUCT_ID_FAILURE,
  GET_PRICE_BY_PRODUCT_ID_SUCCESS
} from '../../../actions/inventory/product/type'

const initialState = {
  priceByProduct: [],
  error: null
}

const getPriceByProductIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRICE_BY_PRODUCT_ID_SUCCESS:
      return {
        ...state,
        priceByProduct: action.payload,
        error: null
      }
    case GET_PRICE_BY_PRODUCT_ID_FAILURE:
      return {
        ...state,
        priceByProduct: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default getPriceByProductIdReducer
