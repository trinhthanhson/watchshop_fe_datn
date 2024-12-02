import {
  GET_ALL_PRODUCT_COUPON_FAILURE,
  GET_ALL_PRODUCT_COUPON_REQUEST,
  GET_ALL_PRODUCT_COUPON_SUCCESS
} from './type'

export const getAllProductCouponRequest = () => ({
  type: GET_ALL_PRODUCT_COUPON_REQUEST
})

export const getAllProductCouponSuccess = (product) => ({
  type: GET_ALL_PRODUCT_COUPON_SUCCESS,
  payload: product
})

export const getAllProductCouponFailure = (error) => ({
  type: GET_ALL_PRODUCT_COUPON_FAILURE,
  payload: error
})
