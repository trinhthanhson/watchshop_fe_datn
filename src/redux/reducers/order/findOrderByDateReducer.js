import {
  SEARCH_ORDER_BY_DATE_FAILURE,
  SEARCH_ORDER_BY_DATE_SUCCESS
} from '../../actions/order/type'

const initialState = {
  orderByDate: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const findOrderByDateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_ORDER_BY_DATE_SUCCESS:
      return {
        ...state,
        orderByDate: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case SEARCH_ORDER_BY_DATE_FAILURE:
      return {
        ...state,
        orderByDate: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default findOrderByDateReducer
