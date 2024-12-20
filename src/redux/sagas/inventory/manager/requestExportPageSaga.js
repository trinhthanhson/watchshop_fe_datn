import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllRequestExportPageFailure,
  getAllRequestExportPageSuccess
} from '../../../actions/inventory/manager/action'
import { GET_ALL_REQUEST_EXPORT_PAGE_REQUEST } from '../../../actions/inventory/manager/type'

function* getAllRequestExportPageSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit, sortField, sortDirection } = action.payload // Nhận thêm sortField và sortDirection từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/inventory/request/all/export?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllRequestExportPageSuccess(response.data))
  } catch (error) {
    yield put(getAllRequestExportPageFailure(error))
  }
}
export default function* requestExportPageSaga() {
  yield takeLatest(
    GET_ALL_REQUEST_EXPORT_PAGE_REQUEST,
    getAllRequestExportPageSaga
  )
}
