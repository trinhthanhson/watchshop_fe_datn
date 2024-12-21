import {
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_FAILURE,
  GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_SUCCESS
} from '../../actions/customer/type'

const initialState = {
  orderStatusCustomerPage: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const orderStatusCustomerPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_SUCCESS:
      return {
        ...state,
        orderStatusCustomerPage: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_FAILURE:
      return {
        ...state,
        orderStatusCustomerPage: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default orderStatusCustomerPageReducer
