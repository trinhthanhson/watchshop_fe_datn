import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllTransactionExportFailure,
  getAllTransactionExportSuccess
} from '../../../actions/inventory/manager/action'
import { GET_ALL_TRANSACTION_EXPORT_REQUEST } from '../../../actions/inventory/manager/type'

function* getAllTransactionExportSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/inventory/transaction/all/export',
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
  yield takeLatest(
    GET_ALL_TRANSACTION_EXPORT_REQUEST,
    getAllTransactionExportSaga
  )
}
