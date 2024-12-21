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
    const { orders, page, limit, sortField, sortDirection } = action.payload
    console.log(orders)
    const response = yield call(
      axios.post,
      `http://localhost:9999/api/customer/order/status/customer?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`,
      orders, // Gửi orders trong body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
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
