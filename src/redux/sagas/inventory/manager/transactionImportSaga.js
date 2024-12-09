import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllTransactionImportFailure,
  getAllTransactionImportSuccess
} from '../../../actions/inventory/manager/action'
import { GET_ALL_TRANSACTION_IMPORT_REQUEST } from '../../../actions/inventory/manager/type'
function* getAllTransactionSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/inventory/transaction/all/import`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllTransactionImportSuccess(response.data))
  } catch (error) {
    yield put(getAllTransactionImportFailure(error))
  }
}

export default function* transactionImportSaga() {
  yield takeLatest(GET_ALL_TRANSACTION_IMPORT_REQUEST, getAllTransactionSaga)
}
