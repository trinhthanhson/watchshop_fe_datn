import { takeLatest, call, put } from 'redux-saga/effects'
import axios from 'axios'
import {
  getStatisticFailure,
  getStatisticSuccess
} from '../../actions/statistic/action'
import { GET_STATISTIC_REQUEST } from '../../actions/statistic/type'

function* getStatisticSaga(action) {
  try {
    const token = localStorage.getItem('token') // Lấy JWT từ localStorage
    const { startDate, endDate, type } = action.payload // Lấy dữ liệu từ payload

    // Gửi request GET với tham số
    const response = yield call(
      axios.get,
      `http://localhost:9999/api/transaction/statistic/all/type`,
      {
        params: {
          startDate: startDate || null, // Gửi `null` nếu không có giá trị
          endDate: endDate || null,
          type_name: type // Truyền `type` chính xác
        },
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      }
    )

    // Nếu thành công, dispatch action success
    console.log(response.data.data)
    yield put(getStatisticSuccess(response.data.data))
  } catch (error) {
    console.error('Error:', error) // Debug lỗi
    // Nếu lỗi, dispatch action failure
    yield put(getStatisticFailure(error))
  }
}

export default function* statisticSaga() {
  yield takeLatest(GET_STATISTIC_REQUEST, getStatisticSaga)
}
