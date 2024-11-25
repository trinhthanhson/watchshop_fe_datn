import { GET_STATISTIC_FAILURE } from './type'
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
