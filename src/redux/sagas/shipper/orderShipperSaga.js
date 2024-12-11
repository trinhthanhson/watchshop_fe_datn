import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllOrderShipperFailure,
  getAllOrderShipperSuccess
} from '../../actions/shipper/action'
import { GET_ALL_ORDERS_SHIPPER_REQUEST } from '../../actions/shipper/type'

function* getAllOrderShipperSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/shipper/order/all?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllOrderShipperSuccess(response.data))
  } catch (error) {
    yield put(getAllOrderShipperFailure(error))
  }
}

export default function* orderShipperSaga() {
  yield takeLatest(GET_ALL_ORDERS_SHIPPER_REQUEST, getAllOrderShipperSaga)
}
