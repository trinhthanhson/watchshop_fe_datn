import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllRequestImportFailure,
  getAllRequestImportSuccess
} from '../../../actions/inventory/manager/action'
import { GET_ALL_REQUEST_IMPORT_REQUEST } from '../../../actions/inventory/manager/type'

function* getAllRequestImportSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/inventory/request/all/import?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllRequestImportSuccess(response.data))
  } catch (error) {
    yield put(getAllRequestImportFailure(error))
  }
}

export default function* requestImportSaga() {
  yield takeLatest(GET_ALL_REQUEST_IMPORT_REQUEST, getAllRequestImportSaga)
}
