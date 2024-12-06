import {
  GET_ALL_TRANSACTION_IMPORT_FAILURE,
  GET_ALL_TRANSACTION_IMPORT_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  transaction_import: [],
  error: null
}

const transactionImportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TRANSACTION_IMPORT_SUCCESS:
      return {
        ...state,
        transaction_import: action.payload,
        error: null
      }
    case GET_ALL_TRANSACTION_IMPORT_FAILURE:
      return {
        ...state,
        transaction_import: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default transactionImportReducer
