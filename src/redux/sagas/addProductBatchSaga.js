import { call, put, takeEvery } from 'redux-saga/effects'
import { ADD_PRODUCT_REQUEST_BATCH } from '../actions/types'

// Worker Saga: thực hiện cập nhật hàng loạt sản phẩm
function* addProductsBatch(action) {
  try {
    const { products } = action.payload
    const token = localStorage.getItem('token')

    const response = yield call(() =>
      fetch('http://localhost:9999/api/staff/product/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(products) // Gửi mảng sản phẩm
      })
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = yield response.json()
    yield put({ type: 'ADD_PRODUCT_SUCCESS_BATCH', payload: responseData })
  } catch (error) {
    yield put({ type: 'ADD_PRODUCT_FAILURE_BATCH', error: error.message })
  }
}

// Watcher Saga: theo dõi các hành động ADD_PRODUCT_REQUEST_BATCH
function* watchAddProductsBatch() {
  yield takeEvery(ADD_PRODUCT_REQUEST_BATCH, addProductsBatch)
}

export default watchAddProductsBatch
