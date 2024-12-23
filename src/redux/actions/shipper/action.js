import {
  GET_ALL_ORDERS_SHIPPER_ACCEPT_FAILURE,
  GET_ALL_ORDERS_SHIPPER_ACCEPT_REQUEST,
  GET_ALL_ORDERS_SHIPPER_ACCEPT_SUCCESS,
  GET_ALL_ORDERS_SHIPPER_FAILURE,
  GET_ALL_ORDERS_SHIPPER_REQUEST,
  GET_ALL_ORDERS_SHIPPER_SUCCESS
} from './type'

//-----------get all order shipper----------------
export const getAllOrderShipperRequest = (page, limit) => ({
  type: GET_ALL_ORDERS_SHIPPER_REQUEST,
  payload: { page, limit }
})
export const getAllOrderShipperSuccess = (order_shipper) => ({
  type: GET_ALL_ORDERS_SHIPPER_SUCCESS,
  payload: order_shipper
})

export const getAllOrderShipperFailure = (error) => ({
  type: GET_ALL_ORDERS_SHIPPER_FAILURE,
  payload: error
})
//-------------------------------------------------

//-----------get all order shipper----------------
export const getAllOrderShipperAcceptRequest = (page, limit) => ({
  type: GET_ALL_ORDERS_SHIPPER_ACCEPT_REQUEST,
  payload: { page, limit }
})
export const getAllOrderShipperAcceptSuccess = (order_shipper) => ({
  type: GET_ALL_ORDERS_SHIPPER_ACCEPT_SUCCESS,
  payload: order_shipper
})

export const getAllOrderShipperAcceptFailure = (error) => ({
  type: GET_ALL_ORDERS_SHIPPER_ACCEPT_FAILURE,
  payload: error
})
//-------------------------------------------------
