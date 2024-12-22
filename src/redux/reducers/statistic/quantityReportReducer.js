import {
  GET_QUANTITY_PRODUCT_REPORT_FAILURE,
  GET_QUANTITY_PRODUCT_REPORT_SUCCESS
} from '../../actions/statistic/type'

const initialState = {
  quantity_report: [],
  error: null,
  currentPage: 1,
  totalPages: 0
}

const quantityReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_QUANTITY_PRODUCT_REPORT_SUCCESS:
      return {
        ...state,
        quantity_report: action.payload,
        error: null,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages
      }
    case GET_QUANTITY_PRODUCT_REPORT_FAILURE:
      return {
        ...state,
        quantity_report: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default quantityReportReducer
