import {
  GET_DATA_NOT_FULL_FAILURE,
  GET_DATA_NOT_FULL_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  data: null,
  error: null
}

const getDataNotFullReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_NOT_FULL_SUCCESS:
      return {
        ...state,
        data: action.data, // Sửa thành action.data
        error: null
      }
    case GET_DATA_NOT_FULL_FAILURE:
      return {
        ...state,
        data: null, // Đặt về null thay vì mảng rỗng
        error: action.error
      }
    default:
      return state
  }
}

export default getDataNotFullReducer
