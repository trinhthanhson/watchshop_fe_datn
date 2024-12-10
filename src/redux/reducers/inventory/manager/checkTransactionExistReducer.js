import {
  CHECK_REQUEST_EXISTS_FAILURE,
  CHECK_REQUEST_EXISTS_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  loading: false,
  check_transaction: null, // Giá trị true/false sau khi kiểm tra
  error: null
}

const checkRequestExistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_REQUEST_EXISTS_SUCCESS:
      return {
        ...state,
        check_transaction: action.payload,
        error: null
      }
    case CHECK_REQUEST_EXISTS_FAILURE:
      return {
        ...state,
        check_transaction: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default checkRequestExistsReducer
