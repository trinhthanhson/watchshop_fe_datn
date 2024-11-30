import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllRevenueProductFailure,
  getAllRevenueProductSuccess
} from '../../actions/statistic/action'
import { GET_REVENUE_PRODUCT_REPORT_REQUEST } from '../../actions/statistic/type'

function* revenueProductReportSaga(action) {
  const { filter, start, end } = action.payload // Lấy các tham số từ payload
  try {
    const token = localStorage.getItem('token')
    const response = yield call(
      axios.get,
      'http://localhost:9999/api/statistic/revenue/product',
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
    yield put(getAllRevenueProductSuccess(response.data))
  } catch (error) {
    // Gửi lỗi lên reducer
    yield put(getAllRevenueProductFailure(error.message))
  }
}

export default function* revenueProductSaga() {
  yield takeLatest(GET_REVENUE_PRODUCT_REPORT_REQUEST, revenueProductReportSaga)
}
