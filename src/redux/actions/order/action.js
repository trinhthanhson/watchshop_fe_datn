import {
  GET_ALL_ORDER_PAGE_FAILURE,
  GET_ALL_ORDER_PAGE_REQUEST,
  GET_ALL_ORDER_PAGE_SUCCESS,
  SEARCH_ORDER_BY_STATUS_REQUEST,
  SEARCH_ORDER_BY_STATUS_FAILURE,
  SEARCH_ORDER_BY_STATUS_SUCCESS,
  SEARCH_ORDER_BY_DATE_REQUEST,
  SEARCH_ORDER_BY_DATE_SUCCESS,
  SEARCH_ORDER_BY_DATE_FAILURE,
  SEARCH_ORDER_BY_DATE_STATUS_REQUEST,
  SEARCH_ORDER_BY_DATE_STATUS_SUCCESS,
  SEARCH_ORDER_BY_DATE_STATUS_FAILURE,
  SEARCH_ORDER_BY_INFO_REQUEST,
  SEARCH_ORDER_BY_INFO_SUCCESS,
  SEARCH_ORDER_BY_INFO_FAILURE
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

// #region find order by status id
export const searchOrderByStatusRequest = (status_id, page, limit) => ({
  type: SEARCH_ORDER_BY_STATUS_REQUEST,
  payload: { status_id, page, limit }
})

// Action khi tìm kiếm thành công
export const searchOrderByStatusSuccess = (orderByStatus) => ({
  type: SEARCH_ORDER_BY_STATUS_SUCCESS,
  payload: orderByStatus
})

// Action khi tìm kiếm thất bại
export const searchOrderByStatusFailure = (error) => ({
  type: SEARCH_ORDER_BY_STATUS_FAILURE,
  payload: error
})
// #endregion

// #region find order by status id
export const searchOrderByDateRequest = (startDate, endDate, page, limit) => ({
  type: SEARCH_ORDER_BY_DATE_REQUEST,
  payload: { startDate, endDate, page, limit }
})

// Action khi tìm kiếm thành công
export const searchOrderByDateSuccess = (orderByStatus) => ({
  type: SEARCH_ORDER_BY_DATE_SUCCESS,
  payload: orderByStatus
})

// Action khi tìm kiếm thất bại
export const searchOrderByDateFailure = (error) => ({
  type: SEARCH_ORDER_BY_DATE_FAILURE,
  payload: error
})
// #endregion

// #region find order by status id
export const searchOrderByDateAndStatusRequest = (
  startDate,
  endDate,
  status_id,
  page,
  limit
) => ({
  type: SEARCH_ORDER_BY_DATE_STATUS_REQUEST,
  payload: { startDate, endDate, status_id, page, limit }
})

export const searchOrderByDateAndStatusSuccess = (orderByStatus) => ({
  type: SEARCH_ORDER_BY_DATE_STATUS_SUCCESS,
  payload: orderByStatus
})

export const searchOrderByDateAndStatusFailure = (error) => ({
  type: SEARCH_ORDER_BY_DATE_STATUS_FAILURE,
  payload: error
})
// #endregion

// #region find order by info
export const searchOrderByInfoRequest = (
  startDate,
  endDate,
  status_id,
  recipient_name,
  recipient_phone,
  page,
  limit
) => ({
  type: SEARCH_ORDER_BY_INFO_REQUEST,
  payload: {
    startDate,
    endDate,
    status_id,
    recipient_name,
    recipient_phone,
    page,
    limit
  }
})

// Action khi tìm kiếm thành công
export const searchOrderByInfoSuccess = (orderByStatus) => ({
  type: SEARCH_ORDER_BY_INFO_SUCCESS,
  payload: orderByStatus
})

// Action khi tìm kiếm thất bại
export const searchOrderByInfoFailure = (error) => ({
  type: SEARCH_ORDER_BY_INFO_FAILURE,
  payload: error
})
// #endregion
