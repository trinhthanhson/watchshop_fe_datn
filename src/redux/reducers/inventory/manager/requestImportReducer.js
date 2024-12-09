import {
  GET_ALL_REQUEST_IMPORT_FAILURE,
  GET_ALL_REQUEST_IMPORT_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  request_import: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const requestImportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REQUEST_IMPORT_SUCCESS:
      return {
        ...state,
        request_import: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_REQUEST_IMPORT_FAILURE:
      return {
        ...state,
        request_import: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default requestImportReducer
