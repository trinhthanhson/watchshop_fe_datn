import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  searchOrderByInfoFailure,
  searchOrderByInfoSuccess
} from '../../actions/order/action'
import { SEARCH_ORDER_BY_INFO_REQUEST } from '../../actions/order/type'

function* getAllOrderByInfoSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const {
      startDate,
      endDate,
      status_id,
      recipient_name,
      recipient_phone,
      page,
      limit
    } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/staff/order/filter/info?startDate=${startDate}&endDate=${endDate}&status_id=${status_id}&recipient_name=${recipient_name}&recipient_phone=${recipient_phone}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(searchOrderByInfoSuccess(response.data))
  } catch (error) {
    yield put(searchOrderByInfoFailure(error))
  }
}

export default function* findOrderByInfoSaga() {
  yield takeLatest(SEARCH_ORDER_BY_INFO_REQUEST, getAllOrderByInfoSaga)
}
