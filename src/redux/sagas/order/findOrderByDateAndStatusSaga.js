import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  searchOrderByDateAndStatusFailure,
  searchOrderByDateAndStatusSuccess
} from '../../actions/order/action'
import { SEARCH_ORDER_BY_DATE_STATUS_REQUEST } from '../../actions/order/type'

function* getFindOrderByDateAndStatusSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { startDate, endDate, status_id, page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/staff/order/filter/status/date?startDate=${startDate}&endDate=${endDate}&status_id=${status_id}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(searchOrderByDateAndStatusSuccess(response.data))
  } catch (error) {
    yield put(searchOrderByDateAndStatusFailure(error))
  }
}

export default function* findOrderByDateAndStatusSaga() {
  yield takeLatest(
    SEARCH_ORDER_BY_DATE_STATUS_REQUEST,
    getFindOrderByDateAndStatusSaga
  )
}
