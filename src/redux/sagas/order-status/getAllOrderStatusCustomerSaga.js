import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllOrderStatusCustomerFailure,
  getAllOrderStatusCustomerSuccess
} from '../../actions/order-status/action'
import { GET_ALL_ORDER_STATUS_CUSTOMER_REQUEST } from '../../actions/order-status/type'

function* getAllOrderStatusCustomerSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/customer/order/status/all',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllOrderStatusCustomerSuccess(response.data))
  } catch (error) {
    yield put(getAllOrderStatusCustomerFailure(error))
  }
}

export default function* getOrderStatusCustomerSaga() {
  yield takeLatest(
    GET_ALL_ORDER_STATUS_CUSTOMER_REQUEST,
    getAllOrderStatusCustomerSaga
  )
}
