import {
  GET_ALL_ORDER_STATUS_CUSTOMER_FAILURE,
  GET_ALL_ORDER_STATUS_CUSTOMER_SUCCESS
} from '../../actions/order-status/type'

const initialState = {
  orderStatusCustomer: [],
  error: null
}

const orderStatusCustomerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER_STATUS_CUSTOMER_SUCCESS:
      return {
        ...state,
        orderStatusCustomer: action.payload,
        error: null
      }
    case GET_ALL_ORDER_STATUS_CUSTOMER_FAILURE:
      return {
        ...state,
        orderStatusCustomer: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default orderStatusCustomerReducer
