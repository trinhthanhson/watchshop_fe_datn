import {
  UPDATE_PRICE_FAILURE,
  UPDATE_PRICE_SUCCESS
} from '../../../actions/inventory/product/type'

const initialState = {
  update_price: null,
  error: null
}

const updatePriceProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRICE_SUCCESS:
      return {
        ...state,
        update_price: action.payload, // Sử dụng action.payload
        error: null
      }
    case UPDATE_PRICE_FAILURE:
      return {
        ...state,
        update_price: null, // Đặt về null thay vì mảng rỗng
        error: action.error
      }
    default:
      return state
  }
}

export default updatePriceProductReducer
