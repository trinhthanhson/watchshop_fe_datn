import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllRequestExportFailure,
  getAllRequestExportSuccess
} from '../../../actions/inventory/manager/action'
import { GET_ALL_REQUEST_EXPORT_REQUEST } from '../../../actions/inventory/manager/type'

function* getAllRequestExportSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/inventory/request/all/export',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllRequestExportSuccess(response.data))
  } catch (error) {
    yield put(getAllRequestExportFailure(error))
  }
}

export default function* requestExportSaga() {
  yield takeLatest(GET_ALL_REQUEST_EXPORT_REQUEST, getAllRequestExportSaga)
}
