import {
  GET_ALL_REQUEST__EXPORT_PAGE_FAILURE,
  GET_ALL_REQUEST_EXPORT_PAGE_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  requestExport: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const requestExportPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REQUEST_EXPORT_PAGE_SUCCESS:
      return {
        ...state,
        requestExport: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_ALL_REQUEST__EXPORT_PAGE_FAILURE:
      return {
        ...state,
        requestExport: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default requestExportPageReducer
