import { call, put, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import {
  createTransactionFailure,
  createTransactionSuccess
} from '../actions/actions'
import { CREATE_TRANSACTION_REQUEST } from '../actions/types'
function* handleCreateTransaction(action) {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(() =>
      axios.post(
        'http://localhost:9999/api/inventory/request/add',
        action.payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
    )
    console.log(response)
    if (response.data.code === 200) {
      yield put(createTransactionSuccess(response.data))

      // Điều hướng
      action.navigate('/inventory/request/import')
    } else {
      throw new Error(response.data.message || 'Something went wrong')
    }

    yield put(createTransactionSuccess(response.data))
  } catch (error) {
    yield put(createTransactionFailure(error.message))
  }
}

export default function* createRequestSaga() {
  yield takeLatest(CREATE_TRANSACTION_REQUEST, handleCreateTransaction)
}
