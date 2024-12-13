import {
  SEARCH_PRODUCT_FAILURE,
  SEARCH_PRODUCT_SUCCESS
} from '../../actions/user/type'

const initialState = {
  product_find: [], // Danh sách sản phẩm tìm được
  pagination: {
    // Thông tin phân trang
    totalPages: 0,
    totalElements: 0
  },
  error: null
}

const getProductByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCT_SUCCESS:
      return {
        ...state,
        product_find: action.payload.data,
        pagination: {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements
        },
        error: null
      }
    case SEARCH_PRODUCT_FAILURE:
      return {
        ...state,
        product_find: [],
        pagination: { totalPages: 0, totalElements: 0 },
        error: action.payload
      }
    default:
      return state
  }
}

export default getProductByIdReducer
