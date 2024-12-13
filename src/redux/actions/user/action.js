import {
  GET_ALL_PRODUCT_COUPON_FAILURE,
  GET_ALL_PRODUCT_COUPON_REQUEST,
  GET_ALL_PRODUCT_COUPON_SUCCESS,
  GET_ALL_PRODUCTS_PAGE_FAILURE,
  GET_ALL_PRODUCTS_PAGE_REQUEST,
  GET_ALL_PRODUCTS_PAGE_SUCCESS,
  SEARCH_PRODUCT_FAILURE,
  SEARCH_PRODUCT_REQUEST,
  SEARCH_PRODUCT_SUCCESS
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

// #region get all product pageable
export const getAllProductsPageRequest = (page, limit) => ({
  type: GET_ALL_PRODUCTS_PAGE_REQUEST,
  payload: { page, limit }
})

export const getAllProductsPageSuccess = (products) => ({
  type: GET_ALL_PRODUCTS_PAGE_SUCCESS,
  payload: products
})

export const getAllProductsPageFailure = (error) => ({
  type: GET_ALL_PRODUCTS_PAGE_FAILURE,
  payload: error
})
// #endregion

// #region find product by id
export const searchProductByIdRequest = (product_id, page, limit) => ({
  type: SEARCH_PRODUCT_REQUEST,
  payload: { product_id, page, limit }
})

// Action khi tìm kiếm thành công
export const searchProductByIdSuccess = (product) => ({
  type: SEARCH_PRODUCT_SUCCESS,
  payload: product
})

// Action khi tìm kiếm thất bại
export const searchProductByIdFailure = (error) => ({
  type: SEARCH_PRODUCT_FAILURE,
  payload: error
})
// #endregion
