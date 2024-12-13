import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  searchOrderByStatusFailure,
  searchOrderByStatusSuccess
} from '../../actions/order/action'
import { SEARCH_ORDER_BY_STATUS_REQUEST } from '../../actions/order/type'

function* getFindOrderByStatusSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { status_id, page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/staff/order/search/status?status_id=${status_id}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(searchOrderByStatusSuccess(response.data))
  } catch (error) {
    yield put(searchOrderByStatusFailure(error))
  }
}

export default function* findOrderByStatusSaga() {
  yield takeLatest(SEARCH_ORDER_BY_STATUS_REQUEST, getFindOrderByStatusSaga)
}
