import {
  GET_ALL_ORDER_CUSTOMER_PAGE_FAILURE,
  GET_ALL_ORDER_CUSTOMER_PAGE_REQUEST,
  GET_ALL_ORDER_CUSTOMER_PAGE_SUCCESS,
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_FAILURE,
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_REQUEST,
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_SUCCESS
} from './type'

// -------- Get all orders customer page---------
export const getAllOrderCustomerPageRequest = (
  page,
  limit,
  sortField = 'created_at',
  sortDirection = 'asc'
) => ({
  type: GET_ALL_ORDER_CUSTOMER_PAGE_REQUEST,
  payload: { page, limit, sortField, sortDirection }
})
export const getAllOrderCustomerPageSuccess = (orderCustomerPage) => ({
  type: GET_ALL_ORDER_CUSTOMER_PAGE_SUCCESS,
  payload: orderCustomerPage
})

export const getAllOrderCustomerPageFailure = (error) => ({
  type: GET_ALL_ORDER_CUSTOMER_PAGE_FAILURE,
  payload: error
})
// -----------------------------------------------

// -------- Get all orders status customer page---------
export const getAllOrderStatusCustomerPageRequest = (
  status_id,
  page,
  limit,
  sortField = 'created_at',
  sortDirection = 'asc'
) => ({
  type: GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_REQUEST,
  payload: { status_id, page, limit, sortField, sortDirection }
})
export const getAllOrderStatusCustomerPageSuccess = (
  orderStatusCustomerPage
) => ({
  type: GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_SUCCESS,
  payload: orderStatusCustomerPage
})

export const getAllOrderStatusCustomerPageFailure = (error) => ({
  type: GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_FAILURE,
  payload: error
})
// -----------------------------------------------
