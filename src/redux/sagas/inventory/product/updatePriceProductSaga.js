import { call, put, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import { UPDATE_PRICE_REQUEST } from '../../../actions/inventory/product/type'
import {
  updatePriceProductFailure,
  updatePriceProductSuccess
} from '../../../actions/inventory/product/action'

// Saga xử lý cập nhật giá
function* handleUpdatePriceProduct(action) {
  try {
    const token = localStorage.getItem('token') // Lấy token từ localStorage
    const { product_id, price_new, updated_at } = action.payload
    console.log('dd')
    // Gửi API call
    const response = yield call(() =>
      axios.put(
        'http://localhost:9999/api/staff/product/update/price', // URL API
        {
          product_id,
          price_new, // Giá mới
          updated_at // Ngày áp dụng
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Token xác thực
          }
        }
      )
    )

    // Thành công
    yield put(updatePriceProductSuccess(response.data))
  } catch (error) {
    // Xử lý lỗi
    const errorMessage =
      error.response?.data?.message || 'Đã xảy ra lỗi trong quá trình cập nhật.'
    yield put(updatePriceProductFailure(errorMessage))
  }
}

// Saga lắng nghe action
export default function* updatePriceProductSaga() {
  yield takeLatest(UPDATE_PRICE_REQUEST, handleUpdatePriceProduct)
}
