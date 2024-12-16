import {
  GET_ALL_ORDER_STATUS_FAILURE,
  GET_ALL_ORDER_STATUS_SUCCESS
} from '../../actions/order-status/type'

const initialState = {
  order_status: [],
  error: null
}

const orderStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        order_status: action.payload,
        error: null
      }
    case GET_ALL_ORDER_STATUS_FAILURE:
      return {
        ...state,
        order_status: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default orderStatusReducer
