import {
  GET_ALL_ORDER_CUSTOMER_PAGE_FAILURE,
  GET_ALL_ORDER_CUSTOMER_PAGE_SUCCESS
} from '../../actions/customer/type'

const initialState = {
  orderCustomerPage: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const orderCustomerPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER_CUSTOMER_PAGE_SUCCESS:
      return {
        ...state,
        orderCustomerPage: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_ORDER_CUSTOMER_PAGE_FAILURE:
      return {
        ...state,
        orderCustomerPage: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default orderCustomerPageReducer
