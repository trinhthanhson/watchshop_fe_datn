import {
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
