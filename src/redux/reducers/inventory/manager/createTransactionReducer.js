import {
  CREATE_TRANS_FAILURE,
  CREATE_TRANS_REQUEST,
  CREATE_TRANS_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  loading: false,
  data: null,
  error: null
}
const createTransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TRANS_REQUEST:
      return {
        ...state,
        message: action.payload.message,
        status: action.payload.status,
        code: action.payload.code,
        error: null
      }
    case CREATE_TRANS_SUCCESS:
      return {
        ...state,
        error: action.error
      }
    case CREATE_TRANS_FAILURE:
      return initialState
    default:
      return state
  }
}
export default createTransactionReducer
