import {
  GET_STATISTIC_FAILURE,
  GET_STATISTIC_SUCCESS
} from '../../actions/statistic/type'

const initialState = {
  statistic: [], // Dữ liệu thống kê
  error: null // Thông báo lỗi nếu có
}

const statisticReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STATISTIC_SUCCESS:
      return {
        ...state,
        statistic: action.payload, // payload sẽ là response.data.data
        error: null
      }
    case GET_STATISTIC_FAILURE:
      return {
        ...state,
        statistic: [], // Xóa dữ liệu nếu có lỗi
        error: action.payload
      }
    default:
      return state
  }
}

export default statisticReducer
