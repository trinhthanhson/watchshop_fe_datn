import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllOrderCustomerPageFailure,
  getAllOrderCustomerPageSuccess
} from '../../actions/customer/action'
import { GET_ALL_ORDER_CUSTOMER_PAGE_REQUEST } from '../../actions/customer/type'

function* getAllOrderCustomerPageSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit, sortField, sortDirection } = action.payload // Nhận thêm sortField và sortDirection từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/customer/order/customer/page?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllOrderCustomerPageSuccess(response.data))
  } catch (error) {
    yield put(getAllOrderCustomerPageFailure(error))
  }
}
export default function* orderCustomerPageSaga() {
  yield takeLatest(
    GET_ALL_ORDER_CUSTOMER_PAGE_REQUEST,
    getAllOrderCustomerPageSaga
  )
}
