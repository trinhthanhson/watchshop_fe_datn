import {
  SEARCH_ORDER_BY_STATUS_FAILURE,
  SEARCH_ORDER_BY_STATUS_SUCCESS
} from '../../actions/order/type'

const initialState = {
  orderByStatus: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const findOrderByStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_ORDER_BY_STATUS_SUCCESS:
      return {
        ...state,
        orderByStatus: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case SEARCH_ORDER_BY_STATUS_FAILURE:
      return {
        ...state,
        orderByStatus: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default findOrderByStatusReducer
