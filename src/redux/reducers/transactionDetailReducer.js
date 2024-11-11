import {
  GET_TRANSACTION_DETAIL_FAILURE,
  GET_TRANSACTION_DETAIL_SUCCESS
} from '../actions/types'

const initialState = {
  transactionDetail: null,
  error: null
}

const transactionDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRANSACTION_DETAIL_SUCCESS:
      return {
        ...state,
        transactionDetail: action.payload,
        error: null
      }
    case GET_TRANSACTION_DETAIL_FAILURE:
      return {
        ...state,
        transactionDetail: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default transactionDetailReducer
