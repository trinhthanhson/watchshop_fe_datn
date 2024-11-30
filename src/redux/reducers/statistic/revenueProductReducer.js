import {
  GET_REVENUE_PRODUCT_REPORT_FAILURE,
  GET_REVENUE_PRODUCT_REPORT_SUCCESS
} from '../../actions/statistic/type'

const initialState = {
  revenue_product: [],
  error: null
}

const revenueProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVENUE_PRODUCT_REPORT_SUCCESS:
      return {
        ...state,
        revenue_product: action.payload,
        error: null
      }
    case GET_REVENUE_PRODUCT_REPORT_FAILURE:
      return {
        ...state,
        revenue_product: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default revenueProductReducer
