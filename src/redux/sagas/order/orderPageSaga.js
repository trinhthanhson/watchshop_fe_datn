import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllOrderPageFailure,
  getAllOrderPageSuccess
} from '../../actions/order/action'
import { GET_ALL_ORDER_PAGE_REQUEST } from '../../actions/order/type'

function* getAllOrderPageSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/staff/order/page?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllOrderPageSuccess(response.data))
  } catch (error) {
    yield put(getAllOrderPageFailure(error))
  }
}

export default function* orderPageSaga() {
  yield takeLatest(GET_ALL_ORDER_PAGE_REQUEST, getAllOrderPageSaga)
}
