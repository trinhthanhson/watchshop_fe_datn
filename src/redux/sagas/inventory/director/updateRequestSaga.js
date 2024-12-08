import { call, put, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import {
  updateTransactionFailure,
  updateTransactionSuccess
} from '../../../actions/inventory/director/action'
import { UPDATE_TRANSACTION_REQUEST } from '../../../actions/inventory/director/type'

function* updateTransactionSaga(action) {
  try {
    const { id } = action.payload
    const token = localStorage.getItem('token')

    const response = yield call(() =>
      axios.put(
        `http://localhost:9999/api/director/request/${id}/update`,
        action.payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
    )

    yield put(
      updateTransactionSuccess(
        response.data.message || 'Transaction updated successfully'
      )
    )
  } catch (error) {
    yield put(
      updateTransactionFailure(error.response?.data?.message || error.message)
    )
  }
}

export default function* updateRequestDirectorSaga() {
  yield takeLatest(UPDATE_TRANSACTION_REQUEST, updateTransactionSaga)
}
