import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllTransactionExportFailure,
  getAllTransactionExportSuccess
} from '../../../actions/inventory/manager/action'
import { GET_ALL_TRANSACTION_EXPORT_REQUEST } from '../../../actions/inventory/manager/type'
function* getAllTransactionSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit, sortField, sortDirection } = action.payload // Nhận thêm sortField và sortDirection từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/inventory/transaction/all/export?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllTransactionExportSuccess(response.data))
  } catch (error) {
    yield put(getAllTransactionExportFailure(error))
  }
}
export default function* transactionExportSaga() {
  yield takeLatest(GET_ALL_TRANSACTION_EXPORT_REQUEST, getAllTransactionSaga)
}
