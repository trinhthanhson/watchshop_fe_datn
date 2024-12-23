import {
  GET_ALL_UPDATE_PRICE_FAILURE,
  GET_ALL_UPDATE_PRICE_REQUEST,
  GET_ALL_UPDATE_PRICE_SUCCESS,
  GET_PRICE_BY_PRODUCT_ID_FAILURE,
  GET_PRICE_BY_PRODUCT_ID_REQUEST,
  GET_PRICE_BY_PRODUCT_ID_SUCCESS,
  UPDATE_PRICE_FAILURE,
  UPDATE_PRICE_REQUEST,
  UPDATE_PRICE_SUCCESS
} from './type'

// #region update price product
export const updatePriceProductRequest = (
  product_id,
  price_new,
  updated_at
) => ({
  type: UPDATE_PRICE_REQUEST,
  payload: { product_id, price_new, updated_at }
})

export const updatePriceProductSuccess = (data) => ({
  type: UPDATE_PRICE_SUCCESS,
  payload: data
})

export const updatePriceProductFailure = (error) => ({
  type: UPDATE_PRICE_FAILURE,
  payload: error
})
// #endregion

// #region get all price product
export const getAllPriceProductRequest = () => ({
  type: GET_ALL_UPDATE_PRICE_REQUEST
})

export const getAllPriceProductSuccess = (data) => ({
  type: GET_ALL_UPDATE_PRICE_SUCCESS,
  payload: data
})

export const getAllPriceProductFailure = (error) => ({
  type: GET_ALL_UPDATE_PRICE_FAILURE,
  payload: error
})
// #endregion
// #region get price by product id
export const getPriceByProductIdRequest = (product_id) => ({
  type: GET_PRICE_BY_PRODUCT_ID_REQUEST,
  payload: { product_id }
})

export const getPriceByProductIdSuccess = (data) => ({
  type: GET_PRICE_BY_PRODUCT_ID_SUCCESS,
  payload: data
})

export const getPriceByProductIdFailure = (error) => ({
  type: GET_PRICE_BY_PRODUCT_ID_FAILURE,
  payload: error
})
// #endregion
