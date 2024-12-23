import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { GET_ALL_UPDATE_PRICE_REQUEST } from '../../../actions/inventory/product/type'
import {
  getAllPriceProductFailure,
  getAllPriceProductSuccess
} from '../../../actions/inventory/product/action'

function* getAllPriceProduct() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/staff/product/all/price',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllPriceProductSuccess(response.data))
  } catch (error) {
    yield put(getAllPriceProductFailure(error))
  }
}
export default function* getAllPriceProductSaga() {
  yield takeLatest(GET_ALL_UPDATE_PRICE_REQUEST, getAllPriceProduct)
}
