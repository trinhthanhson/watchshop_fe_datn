import { takeLatest, call, put } from 'redux-saga/effects'
import axios from 'axios'
import {
  getRequestDetailFailure,
  getRequestDetailSuccess
} from '../actions/actions'
import { GET_REQUEST_DETAIL_REQUEST } from '../actions/types'

function* getRequestDetailSaga(action) {
  try {
    const id = action.payload

    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/staff/inventory/request/${id}/get`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const requestDetail = response.data.data

    yield put(getRequestDetailSuccess(requestDetail))
  } catch (error) {
    yield put(getRequestDetailFailure(error))
  }
}

export default function* requestDetailSaga() {
  yield takeLatest(GET_REQUEST_DETAIL_REQUEST, getRequestDetailSaga)
}
