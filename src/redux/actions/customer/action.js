import {
  GET_ALL_ORDER_CUSTOMER_PAGE_FAILURE,
  GET_ALL_ORDER_CUSTOMER_PAGE_REQUEST,
  GET_ALL_ORDER_CUSTOMER_PAGE_SUCCESS,
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_FAILURE,
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_REQUEST,
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_SUCCESS,
  SEARCH_ORDER_CUSTOMER_BY_DATE_FAILURE,
  SEARCH_ORDER_CUSTOMER_BY_DATE_REQUEST,
  SEARCH_ORDER_CUSTOMER_BY_DATE_SUCCESS
} from './type'

// #region Get all orders customer page
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
// #endregion

// #region Get all orders customer by status page
export const getAllOrderStatusCustomerPageRequest = (
  orders,
  page,
  limit,
  sortField = 'created_at',
  sortDirection = 'asc'
) => ({
  type: GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_REQUEST,
  payload: { orders, page, limit, sortField, sortDirection }
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
// #endregion

// #region search orders customer by date page
export const seacrchOrderCustomerByDatePageRequest = (
  startDate,
  endDate,
  page,
  limit,
  sortField = 'created_at',
  sortDirection = 'asc'
) => ({
  type: SEARCH_ORDER_CUSTOMER_BY_DATE_REQUEST,
  payload: { startDate, endDate, page, limit, sortField, sortDirection }
})
export const seacrchOrderCustomerByDatePageSuccess = (searchOrderByDate) => ({
  type: SEARCH_ORDER_CUSTOMER_BY_DATE_SUCCESS,
  payload: searchOrderByDate
})

export const seacrchOrderCustomerByDatePageFailure = (error) => ({
  type: SEARCH_ORDER_CUSTOMER_BY_DATE_FAILURE,
  payload: error
})
// #endregion
