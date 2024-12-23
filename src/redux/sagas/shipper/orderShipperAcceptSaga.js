import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllOrderShipperAcceptFailure,
  getAllOrderShipperAcceptSuccess
} from '../../actions/shipper/action'
import { GET_ALL_ORDERS_SHIPPER_ACCEPT_REQUEST } from '../../actions/shipper/type'

function* getAllOrderShipperAcceptSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const { page, limit } = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/shipper/order/all/accept?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllOrderShipperAcceptSuccess(response.data))
  } catch (error) {
    yield put(getAllOrderShipperAcceptFailure(error))
  }
}

export default function* orderShipperAcceptSaga() {
  yield takeLatest(
    GET_ALL_ORDERS_SHIPPER_ACCEPT_REQUEST,
    getAllOrderShipperAcceptSaga
  )
}
