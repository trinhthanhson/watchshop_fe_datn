import {
  GET_ALL_ORDER_PAGE_FAILURE,
  GET_ALL_ORDER_PAGE_REQUEST,
  GET_ALL_ORDER_PAGE_SUCCESS
} from './type'

// #region get all order
export const getAllOrderPageRequest = (page, limit) => ({
  type: GET_ALL_ORDER_PAGE_REQUEST,
  payload: { page, limit }
})
export const getAllOrderPageSuccess = (order_page) => ({
  type: GET_ALL_ORDER_PAGE_SUCCESS,
  payload: order_page
})

export const getAllOrderPageFailure = (error) => ({
  type: GET_ALL_ORDER_PAGE_FAILURE,
  payload: error
})
// #endregion
