import {
  CREATE_TRANSACTION_FAILURE,
  CREATE_TRANSACTION_REQUEST,
  CREATE_TRANSACTION_SUCCESS
} from '../actions/types'

const initialState = {
  loading: false,
  data: null,
  error: null
}
const createRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TRANSACTION_REQUEST:
      return {
        ...state,
        message: action.payload.message,
        status: action.payload.status,
        code: action.payload.code,
        error: null
      }
    case CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        error: action.error
      }
    case CREATE_TRANSACTION_FAILURE:
      return initialState
    default:
      return state
  }
}
export default createRequestReducer
