import {
  GET_ALL_TRANSACTION_EXPORT_FAILURE,
  GET_ALL_TRANSACTION_EXPORT_SUCCESS
} from '../../../actions/inventory/manager/type'
const initialState = {
  transaction_export: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const transactionExportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TRANSACTION_EXPORT_SUCCESS:
      return {
        ...state,
        transaction_export: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_TRANSACTION_EXPORT_FAILURE:
      return {
        ...state,
        transaction_export: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default transactionExportReducer
