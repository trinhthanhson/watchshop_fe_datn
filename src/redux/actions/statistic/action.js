import {
  GET_QUANTITY_PRODUCT_REPORT_FAILURE,
  GET_QUANTITY_PRODUCT_REPORT_REQUEST,
  GET_QUANTITY_PRODUCT_REPORT_SUCCESS,
  GET_REVENUE_PRODUCT_REPORT_FAILURE,
  GET_REVENUE_PRODUCT_REPORT_REQUEST,
  GET_REVENUE_PRODUCT_REPORT_SUCCESS,
  GET_STATISTIC_FAILURE
} from './type'
import { GET_STATISTIC_SUCCESS, GET_STATISTIC_REQUEST } from './type'

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
export const getAllQuantityProductRequest = (filter) => ({
  type: GET_QUANTITY_PRODUCT_REPORT_REQUEST,
  payload: filter
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

// -------- Get quantity product report ---------
export const getAllRevenueProductRequest = (filter) => ({
  type: GET_REVENUE_PRODUCT_REPORT_REQUEST,
  payload: filter
})

export const getAllRevenueProductSuccess = (revenue_product) => ({
  type: GET_REVENUE_PRODUCT_REPORT_SUCCESS,
  payload: revenue_product
})

export const getAllRevenueProductFailure = (error) => ({
  type: GET_REVENUE_PRODUCT_REPORT_FAILURE,
  payload: error
})
// -----------------------------------------------
