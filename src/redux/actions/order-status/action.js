import {
  GET_ALL_ORDER_STATUS_CUSTOMER_FAILURE,
  GET_ALL_ORDER_STATUS_CUSTOMER_REQUEST,
  GET_ALL_ORDER_STATUS_CUSTOMER_SUCCESS,
  GET_ALL_ORDER_STATUS_FAILURE,
  GET_ALL_ORDER_STATUS_REQUEST,
  GET_ALL_ORDER_STATUS_SUCCESS
} from './type'

export const getAllOrderStatusRequest = () => ({
  type: GET_ALL_ORDER_STATUS_REQUEST
})

export const getAllOrderStatusSuccess = (order_status) => ({
  type: GET_ALL_ORDER_STATUS_SUCCESS,
  payload: order_status
})

export const getAllOrderStatusFailure = (error) => ({
  type: GET_ALL_ORDER_STATUS_FAILURE,
  payload: error
})

// #region all order status
export const getAllOrderStatusCustomerRequest = () => ({
  type: GET_ALL_ORDER_STATUS_CUSTOMER_REQUEST
})

export const getAllOrderStatusCustomerSuccess = (order_status) => ({
  type: GET_ALL_ORDER_STATUS_CUSTOMER_SUCCESS,
  payload: order_status
})

export const getAllOrderStatusCustomerFailure = (error) => ({
  type: GET_ALL_ORDER_STATUS_CUSTOMER_FAILURE,
  payload: error
})
// #endregion
