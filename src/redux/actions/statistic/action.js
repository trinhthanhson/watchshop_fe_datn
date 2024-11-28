import {
  GET_QUANTITY_PRODUCT_REPORT_FAILURE,
  GET_QUANTITY_PRODUCT_REPORT_REQUEST,
  GET_QUANTITY_PRODUCT_REPORT_SUCCESS,
  GET_STATISTIC_FAILURE
} from './type'
import { GET_STATISTIC_SUCCESS } from './type'
import { GET_STATISTIC_REQUEST } from './type'

export const getStatisticRequest = (type, startDate, endDate) => ({
  type: GET_STATISTIC_REQUEST,
  payload: { type, startDate, endDate } // Truyền thêm các tham số cần thiết
})

export const getStatisticSuccess = (data) => ({
  type: GET_STATISTIC_SUCCESS,
  payload: data
})

export const getStatisticFailure = (error) => ({
  type: GET_STATISTIC_FAILURE,
  payload: error
})

// -------- Get quantity product report ---------
export const getAllQuantityProductRequest = () => ({
  type: GET_QUANTITY_PRODUCT_REPORT_REQUEST
})

export const getAllQuantityProductSuccess = (quantity_report) => ({
  type: GET_QUANTITY_PRODUCT_REPORT_SUCCESS,
  payload: quantity_report
})

export const getAllQuantityProductFailure = (error) => ({
  type: GET_QUANTITY_PRODUCT_REPORT_FAILURE,
  payload: error
})
// -----------------------------------------------
