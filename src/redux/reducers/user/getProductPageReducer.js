import {
  GET_ALL_PRODUCTS_PAGE_FAILURE,
  GET_ALL_PRODUCTS_PAGE_SUCCESS
} from '../../actions/user/type'

const initialState = {
  product_page: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const getProductPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS_PAGE_SUCCESS:
      return {
        ...state,
        product_page: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_PRODUCTS_PAGE_FAILURE:
      return {
        ...state,
        product_page: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default getProductPageReducer
