import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_REQUEST } from '../../actions/customer/type'
import {
  getAllOrderStatusCustomerPageFailure,
  getAllOrderStatusCustomerPageSuccess
} from '../../actions/customer/action'

function* AllorderStatusCustomerPageSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { status_id, page, limit, sortField, sortDirection } = action.payload // Nhận thêm sortField và sortDirection từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/customer/order/status/customer?status_id=${status_id}&page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllOrderStatusCustomerPageSuccess(response.data))
  } catch (error) {
    yield put(getAllOrderStatusCustomerPageFailure(error))
  }
}
export default function* orderStatusCustomerPageSaga() {
  yield takeLatest(
    GET_ALL_ORDER_STATUS_CUSTOMER_PAGE_REQUEST,
    AllorderStatusCustomerPageSaga
  )
}
