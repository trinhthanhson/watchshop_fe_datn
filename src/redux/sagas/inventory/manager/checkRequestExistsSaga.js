import { takeLatest, call, put } from 'redux-saga/effects'
import axios from 'axios'
import {
  checkRequestExistsFailure,
  checkRequestExistsSuccess
} from '../../../actions/inventory/manager/action'
import { CHECK_REQUEST_EXISTS_REQUEST } from '../../../actions/inventory/manager/type'

function* checkRequestExistsSaga(action) {
  try {
    const { id } = action.payload
    const token = localStorage.getItem('token')
    const response = yield call(
      axios.get,
      `http://localhost:9999/api/inventory/transaction/${id}/check`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const result = response.data
    yield put(checkRequestExistsSuccess(result))
  } catch (error) {
    yield put(checkRequestExistsFailure(error.response?.data || error.message))
  }
}

export default function* watchCheckRequestExists() {
  yield takeLatest(CHECK_REQUEST_EXISTS_REQUEST, checkRequestExistsSaga)
}
