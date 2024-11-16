import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { getAllRequestFailure, getAllRequestSuccess } from '../actions/actions'
import { GET_ALL_REQUEST_REQUEST } from '../actions/types'

function* getAllRequestSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/staff/inventory/request/all',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllRequestSuccess(response.data))
  } catch (error) {
    yield put(getAllRequestFailure(error))
  }
}

export default function* requestSaga() {
  yield takeLatest(GET_ALL_REQUEST_REQUEST, getAllRequestSaga)
}
