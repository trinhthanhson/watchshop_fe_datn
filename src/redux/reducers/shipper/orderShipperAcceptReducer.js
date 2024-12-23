import {
  GET_ALL_ORDERS_SHIPPER_ACCEPT_FAILURE,
  GET_ALL_ORDERS_SHIPPER_ACCEPT_SUCCESS
} from '../../actions/shipper/type'

const initialState = {
  orderShipperAccept: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const orderShipperAcceptReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDERS_SHIPPER_ACCEPT_SUCCESS:
      return {
        ...state,
        orderShipperAccept: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_ORDERS_SHIPPER_ACCEPT_FAILURE:
      return {
        ...state,
        orderShipperAccept: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default orderShipperAcceptReducer
