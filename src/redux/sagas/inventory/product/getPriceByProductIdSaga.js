import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { GET_PRICE_BY_PRODUCT_ID_REQUEST } from '../../../actions/inventory/product/type'
import {
  getPriceByProductIdFailure,
  getPriceByProductIdSuccess
} from '../../../actions/inventory/product/action'

function* getPriceByProductId(action) {
  try {
    const token = localStorage.getItem('token')
    const { product_id } = action.payload // Nhận thêm sortField và sortDirection từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/staff/product/price?product_id=${product_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getPriceByProductIdSuccess(response.data))
  } catch (error) {
    yield put(getPriceByProductIdFailure(error))
  }
}
export default function* getPriceByProductIdSaga() {
  yield takeLatest(GET_PRICE_BY_PRODUCT_ID_REQUEST, getPriceByProductId)
}
