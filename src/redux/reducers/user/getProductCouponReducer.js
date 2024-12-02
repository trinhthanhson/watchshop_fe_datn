import {
  GET_ALL_PRODUCT_COUPON_FAILURE,
  GET_ALL_PRODUCT_COUPON_SUCCESS
} from '../../actions/user/type'

const initialState = {
  product_coupon: [],
  error: null
}

const getProductCouponReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCT_COUPON_SUCCESS:
      return {
        ...state,
        product_coupon: action.payload,
        error: null
      }
    case GET_ALL_PRODUCT_COUPON_FAILURE:
      return {
        ...state,
        product_coupon: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default getProductCouponReducer
