import {
  SEARCH_ORDER_BY_DATE_STATUS_FAILURE,
  SEARCH_ORDER_BY_DATE_STATUS_SUCCESS
} from '../../actions/order/type'

const initialState = {
  orderByDateStatus: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const findOrderByDateAndStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_ORDER_BY_DATE_STATUS_SUCCESS:
      return {
        ...state,
        orderByDateStatus: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case SEARCH_ORDER_BY_DATE_STATUS_FAILURE:
      return {
        ...state,
        orderByDateStatus: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default findOrderByDateAndStatusReducer
