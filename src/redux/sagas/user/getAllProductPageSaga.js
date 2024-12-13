import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllProductsPageFailure,
  getAllProductsPageSuccess
} from '../../actions/user/action'
import { GET_ALL_PRODUCTS_PAGE_REQUEST } from '../../actions/user/type'

function* getAllProductPageSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/user/product/page?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllProductsPageSuccess(response.data))
  } catch (error) {
    yield put(getAllProductsPageFailure(error))
  }
}

export default function* productPageSaga() {
  yield takeLatest(GET_ALL_PRODUCTS_PAGE_REQUEST, getAllProductPageSaga)
}
