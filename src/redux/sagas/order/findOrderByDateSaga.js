import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  searchOrderByDateFailure,
  searchOrderByDateSuccess
} from '../../actions/order/action'
import { SEARCH_ORDER_BY_DATE_REQUEST } from '../../actions/order/type'

function* getFindOrderByDateSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { startDate, endDate, page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/staff/order/filter/date?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(searchOrderByDateSuccess(response.data))
  } catch (error) {
    yield put(searchOrderByDateFailure(error))
  }
}

export default function* findOrderByDateSaga() {
  yield takeLatest(SEARCH_ORDER_BY_DATE_REQUEST, getFindOrderByDateSaga)
}
