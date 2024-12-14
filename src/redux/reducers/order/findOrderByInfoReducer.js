import {
  SEARCH_ORDER_BY_INFO_FAILURE,
  SEARCH_ORDER_BY_INFO_SUCCESS
} from '../../actions/order/type'

const initialState = {
  orderByInfo: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const findOrderByInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_ORDER_BY_INFO_SUCCESS:
      return {
        ...state,
        orderByInfo: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case SEARCH_ORDER_BY_INFO_FAILURE:
      return {
        ...state,
        orderByInfo: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default findOrderByInfoReducer
