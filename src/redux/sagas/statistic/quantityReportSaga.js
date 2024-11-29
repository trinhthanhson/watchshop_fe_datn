import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllQuantityProductFailure,
  getAllQuantityProductSuccess
} from '../../actions/statistic/action'
import { GET_QUANTITY_PRODUCT_REPORT_REQUEST } from '../../actions/statistic/type'

function* quantityProductReportSaga(action) {
  const { filter, start, end } = action.payload // Lấy các tham số từ payload
  try {
    const token = localStorage.getItem('token')
    const response = yield call(
      axios.get,
      'http://localhost:9999/api/statistic/quantity/report',
      {
        params: {
          filter: filter || '',
          start: start || '',
          end: end || ''
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Gửi dữ liệu thành công lên reducer
    yield put(getAllQuantityProductSuccess(response.data))
  } catch (error) {
    // Gửi lỗi lên reducer
    yield put(getAllQuantityProductFailure(error.message))
  }
}

export default function* quantityReportSaga() {
  yield takeLatest(
    GET_QUANTITY_PRODUCT_REPORT_REQUEST,
    quantityProductReportSaga
  )
}
