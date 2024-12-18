import {
  GET_DATA_AI_BY_QUANTITY_FAILURE,
  GET_DATA_AI_BY_QUANTITY_REQUEST,
  GET_DATA_AI_BY_QUANTITY_SUCCESS
} from './type'

// #region get data ai by quantity
export const getDataAIByQuantityLimitRequest = (quantity) => ({
  type: GET_DATA_AI_BY_QUANTITY_REQUEST,
  payload: quantity
})

// Action khi tìm kiếm thành công
export const getDataAIByQuantityLimitSuccess = (dataAI) => ({
  type: GET_DATA_AI_BY_QUANTITY_SUCCESS,
  payload: dataAI
})

// Action khi tìm kiếm thất bại
export const getDataAIByQuantityLimitFailure = (error) => ({
  type: GET_DATA_AI_BY_QUANTITY_FAILURE,
  payload: error
})
// #endregion
