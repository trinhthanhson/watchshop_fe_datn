import {
  SEARCH_ORDER_CUSTOMER_BY_DATE_FAILURE,
  SEARCH_ORDER_CUSTOMER_BY_DATE_SUCCESS
} from '../../actions/customer/type'

const initialState = {
  searchOrderByDate: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const searchOrderCustomerByDateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_ORDER_CUSTOMER_BY_DATE_SUCCESS:
      return {
        ...state,
        searchOrderByDate: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case SEARCH_ORDER_CUSTOMER_BY_DATE_FAILURE:
      return {
        ...state,
        searchOrderByDate: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default searchOrderCustomerByDateReducer
