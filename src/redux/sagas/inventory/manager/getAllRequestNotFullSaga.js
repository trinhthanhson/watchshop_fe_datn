import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllRequestNotFullFailure,
  getAllRequestNotFullSuccess
} from '../../../actions/inventory/manager/action'
import { GET_ALL_REQUEST_NOT_FULL_REQUEST } from '../../../actions/inventory/manager/type'

function* getRequestNotFullSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/inventory/request/all/not-full',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllRequestNotFullSuccess(response.data))
  } catch (error) {
    yield put(getAllRequestNotFullFailure(error))
  }
}

export default function* getAllRequestNotFullSaga() {
  yield takeLatest(GET_ALL_REQUEST_NOT_FULL_REQUEST, getRequestNotFullSaga)
}
