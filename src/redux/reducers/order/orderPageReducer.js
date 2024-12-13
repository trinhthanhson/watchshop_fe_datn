import {
  GET_ALL_ORDER_PAGE_FAILURE,
  GET_ALL_ORDER_PAGE_SUCCESS
} from '../../actions/order/type'

const initialState = {
  order_page: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const orderPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        order_page: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_ORDER_PAGE_FAILURE:
      return {
        ...state,
        order_page: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default orderPageReducer
