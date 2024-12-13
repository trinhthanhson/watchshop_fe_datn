import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { GET_ALL_ORDER_STATUS_REQUEST } from '../../actions/order-status/type'
import {
  getAllOrderStatusFailure,
  getAllOrderStatusSuccess
} from '../../actions/order-status/action'

function* getAllOrderStatus() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/manager/order-status/all',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllOrderStatusSuccess(response.data))
  } catch (error) {
    yield put(getAllOrderStatusFailure(error))
  }
}

export default function* getOrderStatusSaga() {
  yield takeLatest(GET_ALL_ORDER_STATUS_REQUEST, getAllOrderStatus)
}
