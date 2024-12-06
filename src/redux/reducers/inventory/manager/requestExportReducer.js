import {
  GET_ALL_REQUEST_EXPORT_FAILURE,
  GET_ALL_REQUEST_EXPORT_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  request_export: [],
  error: null
}

const requestExportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REQUEST_EXPORT_SUCCESS:
      return {
        ...state,
        request_export: action.payload,
        error: null
      }
    case GET_ALL_REQUEST_EXPORT_FAILURE:
      return {
        ...state,
        request_export: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default requestExportReducer
