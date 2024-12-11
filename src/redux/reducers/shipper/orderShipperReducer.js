import {
  GET_ALL_ORDERS_SHIPPER_FAILURE,
  GET_ALL_ORDERS_SHIPPER_SUCCESS
} from '../../actions/shipper/type'

const initialState = {
  order_shipper: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const orderShipperReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDERS_SHIPPER_SUCCESS:
      return {
        ...state,
        order_shipper: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_ORDERS_SHIPPER_FAILURE:
      return {
        ...state,
        order_shipper: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default orderShipperReducer
