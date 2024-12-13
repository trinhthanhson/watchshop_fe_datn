import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  searchProductByIdFailure,
  searchProductByIdSuccess
} from '../../actions/user/action'
import { SEARCH_PRODUCT_REQUEST } from '../../actions/user/type'

function* searchProductByIdSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { product_id, page, limit } = action.payload // Nhận thêm tham số phân trang

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/user/product/search`,
      {
        params: { product_id, page, limit },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(searchProductByIdSuccess(response.data)) // Truyền toàn bộ response
  } catch (error) {
    yield put(
      searchProductByIdFailure(error.response?.data || 'Error occurred')
    )
  }
}

// Watcher saga
export default function* productSearchIdSaga() {
  yield takeLatest(SEARCH_PRODUCT_REQUEST, searchProductByIdSaga)
}
