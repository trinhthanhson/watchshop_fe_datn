import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllQuantityProductFailure,
  getAllQuantityProductSuccess
} from '../../actions/statistic/action'
import { GET_QUANTITY_PRODUCT_REPORT_REQUEST } from '../../actions/statistic/type'

function* quantityProductReportSaga(action) {
  const { filter } = action.payload // Lấy filter từ payload
  console.log('Filter being sent:', filter)

  try {
    const token = localStorage.getItem('token')
    const response = yield call(
      axios.get,
      'http://localhost:9999/api/statistic/quantity/report',
      {
        params: { filter }, // Truyền tham số filter
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllQuantityProductSuccess(response.data))
  } catch (error) {
    yield put(getAllQuantityProductFailure(error.message))
  }
}

export default function* quantityReportSaga() {
  yield takeLatest(
    GET_QUANTITY_PRODUCT_REPORT_REQUEST,
    quantityProductReportSaga
  )
}
