import {
  RESET_ADD_PRODUCT_STATE,
  ADD_PRODUCT_SUCCESS_BATCH,
  ADD_PRODUCT_FAILURE_BATCH
} from '../actions/types'

const initialState = {
  message: '',
  status: false,
  code: null,
  error: null
}

const addProductsBatchReducers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT_SUCCESS_BATCH:
      return {
        ...state,
        message: action.payload.message,
        status: action.payload.status,
        code: action.payload.code,
        error: null
      }
    case ADD_PRODUCT_FAILURE_BATCH:
      return {
        ...state,
        error: action.error
      }
    case RESET_ADD_PRODUCT_STATE:
      return initialState
    default:
      return state
  }
}

export default addProductsBatchReducers
