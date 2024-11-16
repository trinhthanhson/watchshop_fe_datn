import { takeLatest, call, put } from 'redux-saga/effects'
import axios from 'axios'
import {
  getTransactionDetailFailure,
  getTransactionDetailSuccess
} from '../actions/actions'
import { GET_TRANSACTION_DETAIL_REQUEST } from '../actions/types'

function* getTransactionDetailSaga(action) {
  try {
    const id = action.payload

    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/inventory/transaction/${id}/get`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const transaction = response.data.data

    yield put(getTransactionDetailSuccess(transaction))
  } catch (error) {
    yield put(getTransactionDetailFailure(error))
  }
}

export default function* transactionDetailSaga() {
  yield takeLatest(GET_TRANSACTION_DETAIL_REQUEST, getTransactionDetailSaga)
}
