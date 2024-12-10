import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  createTransactionExportFailure,
  createTransactionExportSuccess
} from '../../../actions/inventory/manager/action'
import { CREATE_TRANSACTION_EXPORT_REQUEST } from '../../../actions/inventory/manager/type'
function* createTransactionExportSaga(action) {
  try {
    const id = action.payload.id
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('Token is missing or invalid.')
    }

    const response = yield call(
      axios.post,
      `http://localhost:9999/api/inventory/transaction/${id}/add`,
      {}, // Body (nếu cần thêm dữ liệu)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Đảm bảo kiểu nội dung là JSON
        },
        withCredentials: true // Nếu API cần cookie
      }
    )

    const productDetail = response.data

    yield put(createTransactionExportSuccess(productDetail))
  } catch (error) {
    console.error(
      'Error creating transaction:',
      error.response || error.message
    )
    yield put(
      createTransactionExportFailure(error.response?.data || 'Request failed')
    )
  }
}

export default function* createExportSaga() {
  yield takeLatest(
    CREATE_TRANSACTION_EXPORT_REQUEST,
    createTransactionExportSaga
  )
}
