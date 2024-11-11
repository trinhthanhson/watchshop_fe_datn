import {
  GET_ALL_TRANSACTION_FAILURE,
  GET_ALL_TRANSACTION_SUCCESS
} from '../actions/types'

const initialState = {
  transaction: [],
  error: null
}

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TRANSACTION_SUCCESS:
      return {
        ...state,
        transaction: action.payload,
        error: null
      }
    case GET_ALL_TRANSACTION_FAILURE:
      return {
        ...state,
        transaction: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default transactionReducer
