import {
  GET_ALL_REQUEST_NOT_FULL_FAILURE,
  GET_ALL_REQUEST_NOT_FULL_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  request_all: [],
  error: null
}

const getAllRequestNotFullReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REQUEST_NOT_FULL_SUCCESS:
      return {
        ...state,
        request_all: action.payload,
        error: null
      }
    case GET_ALL_REQUEST_NOT_FULL_FAILURE:
      return {
        ...state,
        request_all: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default getAllRequestNotFullReducer
