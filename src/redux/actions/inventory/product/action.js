import {
  UPDATE_PRICE_FAILURE,
  UPDATE_PRICE_REQUEST,
  UPDATE_PRICE_SUCCESS
} from './type'

// #region update price product
// Action request - Không cần payload trong trường hợp này
export const updatePriceProductRequest = (
  product_id,
  price_new,
  updated_at
) => ({
  type: UPDATE_PRICE_REQUEST,
  payload: { product_id, price_new, updated_at }
})

// Action success - Truyền dữ liệu từ API response
export const updatePriceProductSuccess = (data) => ({
  type: UPDATE_PRICE_SUCCESS,
  payload: data // payload chứa thông tin thành công
})

// Action failure - Truyền lỗi nếu xảy ra
export const updatePriceProductFailure = (error) => ({
  type: UPDATE_PRICE_FAILURE,
  payload: error // payload chứa thông tin lỗi
})

// #endregion
