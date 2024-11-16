import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllTransactionFailure,
  getAllTransactionSuccess
} from '../actions/actions'
import { GET_ALL_TRANSACTION_REQUEST } from '../actions/types'

function* getAllTransactionSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/inventory/transaction/all',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllTransactionSuccess(response.data))
  } catch (error) {
    yield put(getAllTransactionFailure(error))
  }
}

export default function* transactionSaga() {
  yield takeLatest(GET_ALL_TRANSACTION_REQUEST, getAllTransactionSaga)
}
