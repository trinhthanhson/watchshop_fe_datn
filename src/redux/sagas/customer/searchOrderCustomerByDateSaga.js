import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { SEARCH_ORDER_CUSTOMER_BY_DATE_REQUEST } from '../../actions/customer/type'
import {
  seacrchOrderCustomerByDatePageFailure,
  seacrchOrderCustomerByDatePageSuccess
} from '../../actions/customer/action'
function* allSearchOrderCustomerByDateSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { startDate, endDate, page, limit, sortField, sortDirection } =
      action.payload
    const response = yield call(
      axios.get,
      `http://localhost:9999/api/customer/order/search/date?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    yield put(seacrchOrderCustomerByDatePageSuccess(response.data))
  } catch (error) {
    yield put(seacrchOrderCustomerByDatePageFailure(error))
  }
}

export default function* searchOrderCustomerByDateSaga() {
  yield takeLatest(
    SEARCH_ORDER_CUSTOMER_BY_DATE_REQUEST,
    allSearchOrderCustomerByDateSaga
  )
}
