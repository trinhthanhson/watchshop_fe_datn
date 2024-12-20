import {
  GET_ALL_TRANSACTION_IMPORT_FAILURE,
  GET_ALL_TRANSACTION_IMPORT_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  transactionImport: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const transactionImportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TRANSACTION_IMPORT_SUCCESS:
      return {
        ...state,
        transactionImport: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_TRANSACTION_IMPORT_FAILURE:
      return {
        ...state,
        transactionImport: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default transactionImportReducer
